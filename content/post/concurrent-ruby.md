---
title: "Multi-file wordcount – an exercise in concurrent Ruby"
date: 2018-07-17T13:41:00-04:00
---

Web frameworks have [TodoMVC](http://todomvc.com/) as a standard exercise, in which you build a little to-do list app. It's a cute way to showcase the features of that framework and get to know it a little better.

My friend Dan Friedman is trying to do the same but for programming languages, with [`concurrent-wc`](https://github.com/dan-f/concurrent-wc/)! It's an exercise to build a utility that mimicks `wc -l` (which counts the lines in a file), but applied to a whole directory – which is a nice excuse to use some concurrency!

Seeing as he and [Nick](https://github.com/nicolashahn) had already written a Go implementation, I thought I'd try my hand at Ruby.

While being a lovely language, Ruby unfortunately doesn't have very powerful concurrency features. Don't expect stellar performance!

## The boring base case

```ruby
def get_results(files, basepath)
  results = {}

  files.each do |f|
    lines = File.readlines File.join(basepath, f)
    results[f] = lines.length
  end

  return results
end
```

We loop through a list of files, sequentially reading their contents and counting the number of lines. We store that value keyed to the file's name in a hash.

## Ruby threads

```ruby
def get_results_green_threaded(files, basepath)
  results = {}
  threads = []
  mu = Mutex.new

  files.each do |f|
    threads << Thread.new do
      lines = File.readlines File.join(basepath, f)
      mu.synchronize do
        results[f] = lines.length
      end
    end
  end

  threads.map(&:join)

  return results
end
```

The `Thread` primitive in Ruby is confusing. Prior to Ruby 1.9, these were "green threads", meaning the Ruby VM runs them in a single native thread, onto which it multiplexes the execution of these pretend threads.

However, as of Ruby 1.9 (we're on 2.4.something at the moment), [`Thread` actually creates a real, native OS thread](https://csinaction.com/2014/10/10/multithreading-in-the-mri-ruby-interpreter/). _However_: these threads don't actually run concurrently (even if they do exist in parallel) because the Ruby VM holds a Global VM Lock (GVL) which ensures only one thread is active at once.

So this isn't likely to give us much of a speedup.

## Native (OS) threads

```ruby
def get_results_system_threads(files, basepath)
  results = {}

  reader, writer = IO.pipe

  files.each do |f|
    fork do
      reader.close # we aren't using the reader pipe inside the forked process

      lines = File.readlines File.join(basepath, f)
      writer.puts lines.length.to_s + "§" + f
    end
  end

  writer.close
  while msg = reader.gets
    length, f = msg.split("§")
    results[f] = length
  end

  Process.waitall

  return results
end
```

It gets a bit gnarly here.

We're doing much the same as before, but instead of calling `Thread.new`, we call `fork`. At that point in the code, an entirely new process is made, bringing with it a copy of the Ruby VM.

Once we're inside the `fork` block, we're running in a totally separate process from the parent. As we're not sharing the memory of the parent at all, we can't just write to a hash – the child process has _its own copy_ of that hash, so there's no way for the parent to know what updates it's making.

Instead, we have to use inter-process communication. Here, I open a UNIX pipe, have each process write their result to it, and read from the pipe until it's drained.

## Performance

```
$ ruby test.rb ~/Desktop
---
System threads and socket IPC - 0.437s
Green threads - 0.460s
Base case - 0.351s
```

Yeah. Not a huge win for Ruby's concurrency primitives here. The added overhead of green threads and native OS threads outweighs any concurrency gain, it seems.

However: the native threaded version can be tweaked a bit. Spawning a new thread for each file we want to parse doesn't make sense. Can we just make a small number of threads, one for each core of the machine's processor, and assign work to those threads dynamically, like [coroutines](https://en.wikipedia.org/wiki/Coroutine)?

```ruby
def get_results_threadpool(files, basepath)
  require 'socket'
  results = {}
  sockets = []
  threads = []

  4.times { sockets << create_socket_slave(basepath) }

  socket_pool = Enumerator.new do |y|
    loop do
      y << sockets[0]
      y << sockets[1]
      y << sockets[2]
      y << sockets[3]
    end
  end

  threads << Thread.new {
    files.each do |f|
      socket_pool.take(1).first.send(f, 0)
    end

    socket_pool.take(4).map { |s| s.send("BREAK", 0)}
  }

  threads << Thread.new {
    files.length.times do
      msg = socket_pool.take(1).first.recv(500).force_encoding('UTF-8')
      length, f = msg.split("§")
      results[f] = length
    end
  }

  threads.map(&:join)

  Process.waitall

  return results
end

def create_socket_slave(basepath)
  parent_socket, child_socket = Socket.pair(:UNIX, :DGRAM, 0)

  fork do
    parent_socket.close
    while f = child_socket.recv(500)
      break if f == "BREAK"
      lines = File.readlines File.join(basepath, f)
      child_socket.send(lines.length.to_s + "§" + f, 0)
    end
  end

  return parent_socket
end
```

So, there's a lot of horror here. For each coroutine, we create a pair of joined sockets (Ruby's `Socket.pair()` makes a syscall to [`socketpair(2)`](http://man7.org/linux/man-pages/man2/socketpair.2.html)). One end gets kept by the parent process, and the other by the child process. They then use these to communicate – the parent sending in a list of files for the children to process; the children sending back the results (until they receive the "BREAK" signal, where they terminate).

(Note that the implementation of these coroutines is very basic. I'm using an `Enumerator` to loop through all the processes round-robin, rather than assigning work to processes that are idle, which would be much more efficient.)

And the results?

```
$ ruby test.rb ~/Desktop
...
System threads and socket IPC - 1.518s
```

Oh well. Thanks for joining my sojourn into concurrency in Ruby!
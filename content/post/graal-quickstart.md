---
title: "Getting started with Graal"
date: 2018-07-30T13:08:37-04:00
---

GraalVM promises to be ["one VM to rule them all"](https://www.semanticscholar.org/paper/One-VM-to-rule-them-all-W%C3%BCrthinger-Wimmer/53e2b31ad6fea91655ecbe64fe66968b934d0160) – a way to "run code faster anywhere".

The way it does this is using language interpreters written in a framework called [Truffle](https://blog.plan99.net/graal-truffle-134d8f28fb69):

> Truffle is a framework for implementing languages using nothing more than a simple abstract syntax tree interpreter.

These interpreters turn your code into an AST which can be run on the GraalVM. This gives you:

* **super fast performance** – e.g. a fourfold increase in speed over Ruby's VM; similar performance to V8 for JavaScript.
* **JIT compilation and debugging for free** – use Chrome DevTools to debug running code.
* **interoperability with other Truffle languages** – because multiple languages can target the same VM, you can call code in one language from another with no performance penalty when crossing the language barrier.

[This article](https://blog.plan99.net/graal-truffle-134d8f28fb69) is an amazing technical introduction to the platform. Below, I'll walk you through getting GraalVM installed and running on your machine.

## Mac quickstart

The community edition of Graal only runs on Linux, so if you're using a Mac, you'll need to emulate! Here's how I did it.

1. Download the latest release of [Graal](https://github.com/oracle/graal/releases).
1. Install Docker, either by [downloading it](https://download.docker.com/mac/static/stable/x86_64/) or using Homebrew (`brew install docker`).

1. `cd` into the Graal download directory and start a Docker container as follows:
```console
$ docker run -i -t -v=`pwd`:/graal ubuntu /bin/bash
```
This will bind-mount your current directory to `/graal` inside the container. When you're in, you can run `cd /graal` and use the binaries in there directly.

## Installing language packs

GraalVM ships with a JVM and its own versions of `node` and `npm`, but out of the box you won't be able to run Ruby, Python, or R.

If you're like me, the first thing you want to do is play around with Ruby on GraalVM. To do this, you need to install TruffleRuby. GraalVM comes with its own package management tool, `gu`, which you can invoke from inside the container:

```console
root# /graal/bin/gu install ruby
Downloading: Component catalog
Processing component archive: Component ruby
Downloading: Component ruby
Installing new component: TruffleRuby (org.graalvm.ruby, version 1.0.0-rc4)
```

## Using the debugger

Graal comes with an awesome debugger that lets you step through your code in Chrome DevTools. To do this, you need to allow connections between your container and the host machine.

```console
$ docker run -i -t -v=`pwd`:/graal \
  -p 9229:9229/tcp ubuntu /bin/bash
```

That `-p` flag opens a port on `9229` on both the container and the host. When you run a Graal command and invoke the debugger, you need to tell it to use that port, and to bind to 0.0.0.0 (as by default it binds to 127.0.0.1 which refuses incoming connections from outside the container):

```console
root# /graal/bin/ruby --inspect="0.0.0.0:9229" mycode.rb
Debugger listening on port 9229.
To start debugging, open the following URL in Chrome:
    chrome-devtools://devtools/bundled/js_app.html?ws=0.0.0.0:9229/ffffffff84647ae2-ffffffa709c7325d
```

Graal will print out a URL that you can copy and paste into Chrome which will drop you into a debugger session.

![](/img/graal-ruby-debug.png)

## What next?

Once you're up and running, check out Chris Seaton's excellent _[Top 10 Things To Do With GraalVM](https://chrisseaton.com/truffleruby/tenthings/)_ for more cool things to try out.
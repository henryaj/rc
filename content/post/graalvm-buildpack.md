---
title: "A Buildpack for GraalVM"
date: 2018-08-08T12:30:43-04:00
---

tl;dr: <a href="#instructions">Deploy your Ruby code to Heroku and have it run on GraalVM</a>.

When deploying code in this brave new cloud world we live in, your app pretty much runs as a brain in a vat. It doesn't (and shouldn't) know about the hardware it's running on, how the services it connects to are implemented, how it send data to your log aggregation tool, and so on.[^12factor]

You get to choose between providing the brain _and_ the vat, or just the brain. 

The brain-and-vat option is a _container_. This lets you specify pretty much everything you want to run: the OS, all the libraries and utilities installed on that OS, and the app code itself. This is what running a [Docker](http://docker.com) container looks like (e.g. on Kubernetes or ECS).

The brain-only option is what [Heroku](http://heroku.com) and [Cloud Foundry](http://cloudfoundry.org) offer. For clarification, please refer to [this helpful haiku](https://twitter.com/onsijoe/status/598235841635360768):

> Here is my source code<br>
> Run it in the cloud for me<br>
> I do not care how

Those platforms take your code, figure out what the hell it is, and then run it for you. In addition to not needing to provide (or even really think about) an OS, it also lets whoever's running your platform make fixes to your app. If a vulnerability is discovered in some system library, for example, the platform operations team can just swap out the base OS for a patched version. If you've provided them a container to run, though, it's just an opaque blob -- you need to update the image on which your container is based and then rebuild it.

So how do the brain-only providers figure out what you want to run?

## Buildpacks

These are chunks of code that decide:

1. what kind of app your app is
2. how to compile it into something executable
3. how to run that executable

These three stages map nicely to the [three executables that must be present in a buildpack](https://devcenter.heroku.com/articles/buildpack-api):

* `bin/detect`
* `bin/compile`
* `bin/release`

### Detect

Decides what kind of app you're running. For Ruby, this might be as simple as asking "does it have a Gemfile?".

If yes, continue with the compile and release steps. Otherwise, try another buildpack until there are no more left.

### Compile

Turns your app into an executable (a 'slug' in Heroku parlance; a 'droplet' in Cloud Foundry parlance). For Ruby, this means running `bundle install`; for Go, this means `dep ensure && go build`, etc.

### Release

Write a `Procfile` that tells the system how to run your app (e.g. `rails server`, `rackup`, `npm start` etc.)

## GraalVM

GraalVM is a VM and a set of interpreters capable of taking various kinds of code (Ruby, Python, R, LLVM bitcode, C, languages that target the JVM like Java and Scala) converting them into some intermediate representation, and running them on a highly-optimised VM (itself written in Java).

It's been in development for several years, and is capable of running Ruby code four times faster than the next-best runtime, provides hooks to debug your code using Chrome DevTools, and provides seamless interoperability between any of these languages with almost zero overhead.

So why can't I push my Ruby code to Heroku and have it run on GraalVM?

### Instructions<a id="instructions"></a>

The source code is [here](https://github.com/henryaj/truffleruby-buildpack).

**To use on Heroku**: run `heroku buildpacks:add` to add this buildpack to your app, and remove the existing Ruby buildpack. You'll need to have pushed your app at least once before to do this.

**To use on Cloud Foundry**: run `cf create-buildpack` to add this buildpack to CF, then update the buildpack order to ensure it runs before the normal Ruby buildpack.

It's pretty bare bones at the moment – it won't build your Rails asset cache, for example – but it should be okay at getting basic Ruby apps running. Note that TruffleRuby is still incomplete, and is missing support for some important Ruby features, so YMMV.

[^12factor]: These principles are all lifted from the concept of [12-factor apps](https://12factor.net/), which are apps that have a clean contract with the underlying OS, and are designed to be portable across clouds.

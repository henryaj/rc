---
title: "Becoming a dramatically better programmer"
date: 2018-05-31T16:15:00-04:00
toc: true
---

In our first week, we were told that the RC faculty wanted to do one thing above else – to remove any obstacles in the way of us becoming _dramatically better programmers_.

But what does that mean? What does getting _dramatically better_ actually look like?

I've outlined a few broad areas that programmers striving to get better might focus on. I've also suggested some ways to tackle these areas –  but _this is by no means complete, or correct!_ [Email me](mailto:henry@henrystanley.com) with your suggestions; I'll add them and credit you below.

## Learning skills directly

On the face of it, object-level[^object] skills seem to be relatively narrow in their application – why learn Haskell or Go unless I'm going to use it in my job?

But knowledge in programming undergoes compounding[^hamming]. Each extra thing you learn isn't isolated, but connected to other nodes in your knowledge graph in ways you might not predict. Getting to grips with Go's unusual concurrency model, while not directly relevant to your day job, might shed light on that tricky concurrency problem you're facing in another language. Fiddling around with metaprogramming in Ruby could prove useful when you're trying to write something in another dynamic language.

### 💡 Picking skills

> * Pick nodes on the knowledge graph which are highly-connected to things you do routinely. For example, if you're a Ruby developer, five minutes spent learning how to use the [`pry` debugger](https://github.com/pry/pry) will provide an enormous and immediate return on investment.
* In this sense, you should lean towards improving highly general skills, like getting to grips with your OS, VCS, text editor, and keyboard shortcuts.
* There may be other nodes on the graph which, while not being super close to your area of expertise, are still highly-connected (perhaps indirectly through other nodes). This explains why learning a language that's very different from the one you normally use can be useful: it can add high-level concepts which can be applied to other domains.
  * One person in the previous RC batch found experimenting with Idris and type-driven development to be not only super interesting, but very relevant as a primer on type theory – which fits into pretty much ever other language.

### Known unknowns

As you learn more skills, you along the way start to create a map not just of the things you've learned, but the landscape of things you know exist but haven't yet conquered. These _known unknowns_ are vitally important in informing what it is you want to learn next, and knowing where to look for solutions when solving problems.

#### 💡 Identifying known unknowns

> * Produce a more complete map of your knowledge graph of a subject – ideally including areas you know exist but don't know much about. Try to expand the graph beyond your known unknowns by reading around the subject, or teaming up with an expert.

## Learning meta-skills

There are also meta-skills you can learn: skills which themselves enable skill acquisition.

### How to learn; deliberate practice

Though the idea of 'learning styles' (e.g. being a visual, aural or kinaesthetic learner) is [likely a myth](https://www.theatlantic.com/science/archive/2018/04/the-myth-of-learning-styles/557687/), no doubt people have their idiosyncrasies in how they prefer to learn and what works best for them. Spending time trying different methods to evaluate what's best for you will surely pay dividends.

Figuring out how best to do [deliberate practice](https://jamesclear.com/beginners-guide-deliberate-practice) in the field you're interested in is also a challenge. Consider that many people still type with two fingers, despite typing daily for many years. Repetition isn't sufficient to learn a new skill – you need to challenge yourself. Expect this to be painful.

#### 💡 Getting better at deliberate practice

> * James Clear has an [amazing guide to deliberate practice](https://jamesclear.com/beginners-guide-deliberate-practice).
* Broadly speaking, you need to _do things that challenge you_ and _get feedback_.
  * Doing things that challenge you means doing really hard things that test the limit of what you're capable of, not just repeating and replaying old knowledge. If you're highly familiar with a programming language, use a new one. You probably instinctively know how frustrating it is to use a language you aren't fluent in – that's a good sign.
  * Getting feedback can be getting your code reviewed, pair programming, or even the linter/compiler telling you your code sucks, but it's crucial that you have a feedback loop to keep you on track.

### Identifying common mistakes

David Cain calls this "[the hole where all the success leaks out](https://www.raptitude.com/2018/05/where-success-leaks/)".

> When amateurs [play tennis], they don’t edge each other out by being slightly more skillful. Instead, it’s a contest of who makes the fewest huge, gaping blunders.
>
> And of course it works that way. Getting to the pros is a long, arduous process, one that filters out players with major flaws in their game. Coaches leap on those flaws as soon as they see them and drill them out of their athletes. Amateurs don’t go through this filtering process...
>
> **Everyone’s strategy, therefore, should be to identify and eliminate these big, costly rookie blunders, one by one.** This is far more effective than getting quicker, hitting harder, or making that one brilliant shot now and then.

#### 💡 Identifying common mistakes

> * Often introspection is all this one takes. If you're honest with yourself, you probably already know what the "hole where all the success leaks out" is. Maybe:
  * you give up on projects or learning new skills way too quickly
  * you're routinely sucked in by your phone or social media and lose hours
  * you don't get enough sleep, and fixing it would make you much more productive
  * you don't ask for help, and all your projects take much longer as a result
* Pretty much all the above apply to me (I'm working on it!). Fixing even one of them could make you dramatically more productive without much effort.

### Deep work

Deep work seems to be one of the most important meta-skills to learn as a programmer (or indeed as a knowledge worker).

Deep work is Cal Newport's name for focused, complex work. _Learning skills_ and _deliberate practice_ are both examples of deep work.

Shallow work, by contrast, is the boring, easy stuff that every job requires, but adds almost no value. Replying to emails, checking IMs, scheduling things – these are all straightforward, but aren't really what you're getting paid to do (although if you neglect to do them, you might find yourself not getting paid at all).

Being able to do deep work seems to be a skill that can be learned. If I get anything out of RC, it might be that – a longer attention span, better awareness of my own foibles and tendencies towards distraction, and some rules for getting deep work done.

#### 💡 Doing more deep work

> * Read the [book](https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692) (or maybe just the [summary](https://www.samuelthomasdavies.com/book-summaries/business/deep-work/)).
* I've found using the pomodoro technique to be very useful – it gives your day a certain rhythm, and it's very motivating to see the deep work rack up!
* Develop a deep work schedule
  * At RC, I try to get in around 10am and do 2–3 hours of deep work before lunch.
  * In [this amazing post](https://azeria-labs.com/the-importance-of-deep-work-the-30-hour-method-for-learning-a-new-skill/), Maria 'Azeria' Markstedter recommends dedicating 30 deep work hours (seven four-hour sessions) to a subject at a minimum. It's too easy to give up after one or two hours before you really know if you like the subject or not; that up-front commitment can be very motivating.
* Start viewing willpower as a resource that can be depleted, and make sure you aren't wasting it on trivial things.
  * switch your phone off so you won't be tempted to check it
  * close distracting apps on your laptop (like IM, mail, social media clients)

_Leave comments on the [Hacker News thread](https://news.ycombinator.com/item?id=17208419)._

[^object]: To clarify the term: if you were having a debate about a particular topic, that would be an _object-level_ debate. If you were debating the vagaries of how things ought to be debated, that would be _meta-level_.

[^hamming]: From Hamming's excellent [_You and Your Research_](https://www.cs.virginia.edu/~robins/YouAndYourResearch.html): <blockquote>Knowledge and productivity are like compound interest. Given two people of approximately the same ability and one person who works ten percent more than the other, the latter will more than twice outproduce the former. The more you know, the more you learn; the more you learn, the more you can do; the more you can do, the more the opportunity - it is very much like compound interest.</blockquote>

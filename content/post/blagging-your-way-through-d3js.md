---
title: "Blagging your way through d3.js"
date: 2018-06-13T17:00:00-04:00
---

With [twelve weeks](https://recurse.com) to do whatever programming projects I wanted, I figure now is the time to try something I've never touched before.

Data visualisation is totally foreign to me (at least, anything beyond charts in Excel is). I was aware of [d3.js](https://d3js.org/), a JavaScript library for graphing data, so I thought I'd try it out.

Turns out it's not a "library for graphing data" at all. It's really a _DOM manipulation library_, or a library for processing data and using it to update elements on a webpage.

That confusion was probably why I found it so damn hard to get it to actually _do_ anything I wanted.

# Getting started

Almost always, when you're starting out with d3, you ask it to create an SVG element on a webpage. This becomes the canvas on which you paint everything else.

```js
let width = 800
let height = 400

let svg = d3.select(DOM.svg(width, height))
```

We've now bound a [`Selection`](https://github.com/d3/d3-selection/blob/a551afef97a6955d01728c1382c2da833077fb36/src/selection/index.js#L43) to the `svg` variable. `Selection` has a bunch of methods defined on it which we can use to manipulate the underlying DOM element (an `<svg>` HTML object, in this case).

# Grouping elements

The SVG standard defines a [`<g> element`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g), a very boring container element used to group things together. A bit like HTML's `<div>`. You can also define attributes on a `<g>` tag and its child elements will inherit them.

# Drawing elements

Okay, we're ready to get something onto the page. Here we go:

```js
svg.append("g")     // put a <g> element inside the <svg>
    .selectAll("rect") // select all <rect> elements inside the <g>
    .data([
        {x: 1, y: 1},
        {x: 2, y: 2},
        {x: 3, y: 4},
        {x: 4, y: 8},
    ])              // for this set of data points...
    .enter()        // when any new data points are added...
    .append("rect") // add a new <g> element with these attributes:
    .attr("fill", "blue")
    .attr("x", xPosition(d))
    .attr("y", yPosition(d))
    .attr("width", 50)
    .attr("height", 50)
```

That's a lot of stuff to draw some squares on a page. Let's break it down further.

## append, selectAll and enter

Here's what's happening in the above code snippet.

```js
svg.append("g")
```

> This inserts a `<g>` element into the element represented by the caller (in this case, we're putting our new `<g>` element inside an `<svg>`).

```js
    .selectAll("rect")
```

> Selects all the `<rect>` elements inside the new `<g>` element. In the first instance, there won't be any such elements, so we get an empty list. That's fine.

```js
    .data([...])
```

> Specifies some data to work with.

```js
    .enter()
    .append("rect")
    .attr("fill", "blue")
    .attr("x", xPosition(d))
    .attr("y", yPosition(d))
    .attr("width", 50)
    .attr("height", 50)
```

> And now the magic: take our data, and _whenever a new data point `.enter()`s the dataset_, append a new `<rect>` with properties (blue, 50 x 50, etc).

You may have guessed that `.enter` has `.exit` and `.update` counterparts, for defining actions to take when data points leave the set or are updated.

The thinking behind this API is that it's much more straightforward to [declaratively tell d3 _what you want_ rather than how to render it](https://bost.ocks.org/mike/join/). This makes all sorts of crazy stuff trivial: live data updates, real-time charts, and interactive visualisations.

## Scaling data

When we set the co-ordinates for our beautiful blue rectangles, we call `xPosition` or `yPosition` on the data point. These functions might look something like this:

```js
let xPosition = d3.scaleLinear()
  	.domain([1, 4])
  	.range([0+margin, width-margin]);
```

By calling `d3.scaleLinear`, we get a function which will take a number and scale it up or down to something more appropriate. `domain` describes the data domain, and `range` is the desired range that data should fill. Here, the domain is numbers between 1 and 4, and the range is any value that would put the _x_ co-ordinate of our `<rect>` inside the SVG (with a little bit of padding).

`yPosition` does something similar, but for the _y_ co-ordinate. SVG has a quirk, though: _y_ co-ordinates go from _top to bottom_ (so the top of the element is zero).

# Why is this so hard I just want a pie chart

The above is actually most of what you need to build something with d3 (though what I've described barely scratches the surface of what's possible) – just don't expect the library to do much for you.

In my experience, going through examples of d3 visualisations written by other people (read: [Mike Bostock](https://bost.ocks.org/mike/)) is the best way to find inspiration.

More concretely, you might find that the higher-level abstractions offered by some of [these awesome libraries](https://github.com/wbkd/awesome-d3) is easier for getting started.

_In part 2, I'll write about my attempts to visualise large numbers using d3 and [Observable](http://https://beta.observablehq.com/)._
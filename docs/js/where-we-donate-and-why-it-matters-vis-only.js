// URL: https://beta.observablehq.com/@henryaj/where-we-donate-and-why-it-matters
// Title: Where we donate, and why it matters
// Author: Henry Stanley (@henryaj)
// Version: 1148
// Runtime version: 1

const m0 = {
  id: "2826cfe0e9dddc64@1148",
  variables: [
    {
      inputs: ["html"],
      value: (function(html){return(
html`<button style="font-size:1.3em;" id="startAnimalsKilledVis">Start</button>`
)})
    },
    {
      inputs: ["d3","generateResponsiveSvg","debug"],
      value: (function(d3,generateResponsiveSvg,debug)
{
  const width = 850
  const height = 500
  
  // Practically, we can't render events more often than every 10ms, which is too slow for
  // the numbers we're dealing with (290 events per second: every 3.44ms).
  //
  // Instead, we'll create a function that renders 29 dots, and call it every 100ms.
  // In reality, we need to call this function slightly more often to get 290 events
  // per second.
  
  d3.select("#startAnimalsKilledVis").on(
    "click", function() {
      d3.interval(paint29, 75) // call paint29() every ~75ms
    }
  )

  let svg = generateResponsiveSvg(width, height);
  let canvas = svg.append("g")
  
  let bloodRed = "#AA0000"
  
  let counter=0

  let paintOne = function() {
    canvas.insert("circle", "rect")
      .attr("cx", Math.random() * width)
      .attr("cy", Math.random() * height)
      .attr("r", 1)
      .style("fill", bloodRed)
      .transition()
      .duration(5000)
      .ease(Math.sqrt)
      .attr("r", 150)
      .style("fill", "white")
      .remove();
    if (debug == true) {
      counter++;
      if (counter % 290 == 0) {
        let d = new Date;
        console.log("---");
        console.log(":" + d.getSeconds())
        console.log(counter);
        console.log("---");
      }
    }
  }
  
  let paintTen = function() {
    let i = 0;
    do {
      i += 1;
      paintOne();
    } while (i < 10);
  }
  
  let paint29 = function() {
    let i = 0;
    do {
      i += 1;
      paintTen();
    } while (i < 2);
    paintOne();
  }
  
  return svg.node();
}
)
    },
    {
      name: "totalAnimalsKilled",
      value: (function(){return(
9.2e9
)})
    },
    {
      name: "pageOpened",
      value: (function(){return(
Date.now()
)})
    },
    {
      name: "animalsKilledPerSecond",
      inputs: ["totalAnimalsKilled"],
      value: (function(totalAnimalsKilled){return(
totalAnimalsKilled / (60*60*24*365)
)})
    },
    {
      name: "generateResponsiveSvg",
      inputs: ["d3","DOM"],
      value: (function(d3,DOM){return(
function(width, height) {
  return d3.select(DOM.svg(width, height))
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-width", "100%")
    .style("height", "auto");
}
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require('d3')
)})
    },
    {
      name: "debug",
      value: (function(){return(
false
)})
    }
  ]
};

const notebook = {
  id: "2826cfe0e9dddc64@1148",
  modules: [m0]
};

export default notebook;

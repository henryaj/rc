// URL: https://beta.observablehq.com/@henryaj/where-we-donate-and-why-it-matters
// Title: Where we donate, and why it matters
// Author: Henry Stanley (@henryaj)
// Version: 1148
// Runtime version: 1

const m0 = {
  id: "2826cfe0e9dddc64@1148",
  variables: [
    {
      inputs: ["md","totalDonations"],
      value: (function(md,totalDonations){return(
md`Americans give away **$${(totalDonations/1e9).toFixed(1)} billion** to charities that help animals every year. But what kind of charities are they supporting?`
)})
    },
    {
      inputs: ["donationStats","html"],
      value: (function(donationStats,html)
{
  let pp = function(number) {
    if (number > 1e9) {
      return "$" + (number / 1e9).toFixed(2) + " billion"
    } else {
      return "$" + (number / 1e6).toFixed(2) + " million"
    }
  }
  
  let tableRow = function(element) {
    let amount = pp(element.amount)
    
    return "<tr>" +
      "<td>" +
        element.label +
      "</td>" +
      "<td>" +
        amount +
    "</td></tr>"
  }
  
  let stats = donationStats.map(x => tableRow(x) )
  return html`<table>
  <th></th>
  <th>Amount donated</th>
    ${stats.join("\n")}
  </table>`
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`Stacked up, that looks like this. Notice how animal shelters are by far the largest recipients of donations; farm and lab animal charities get almost nothing.`
)})
    },
    {
      inputs: ["donationStats","iconarray","generateDots","totalDonations","generateResponsiveSvg","d3","color","wrap"],
      value: (function(donationStats,iconarray,generateDots,totalDonations,generateResponsiveSvg,d3,color,wrap)
{
  
  const data = donationStats;
  const width = 650
  const chartWidth = 500
  const height = 470
  const margin = 50

  let layout = iconarray.layout()
  	.width(12);
 
  let dotCount = 144;
  let radius = 11;
  
  let dataArray = generateDots(data, dotCount, totalDonations);

  let grid = layout(dataArray);
  
  let svg = generateResponsiveSvg(width, height)
  
  let arrayScale = d3.scaleLinear()
  	.domain([0, Math.sqrt(dataArray.length)])
  	.range([0+margin, chartWidth-margin]);
  
  svg.append("g")
    .attr("transform", "translate(" + margin + ", " + margin + ")");
  
  svg.selectAll('circle')
  	.data(grid)
		.enter()
	  .append('circle')
		.attr('cx', function(d){ 
			return arrayScale(d.position.x); 
		})
		.attr('cy', function(d){ 
			return height - arrayScale(d.position.y); 
		})
		.attr('r', radius)
		.attr('fill',function(d){ return d.data; })
  
  svg.append('g')
    .attr('transform','translate('+ (chartWidth)+',' + (height - 300) + ')')
    .selectAll('g.key-element')
    .data(data)
    .enter()
    .append('g')
      .attr('transform',function(d,i){ return 'translate(0,'+(i*60)+')'; })
      .attr('class','key-element')
    .call( function(parent) {
      parent.append('circle')
        .attr('r', radius)
        .attr('cx', -radius*2)
        .attr('cy', -radius)	
        .attr('fill', d => color(d.id))

      parent.append('text')
        .attr("style", "font-family: Roboto Condensed,sans-serif; font-size: 18px;")
        .attr('dx', 0)
        .attr('dy', -0.4)
        .text(function(d){
          return d.label;
    })
    .call(wrap, margin.right-20);
	})

  return svg.node();
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`People clearly want to help animals in need. But a crucial question to ask is: which animals need our help most? Looking at the number of animals killed each year by different industries gives a very different picture to the one above.`
)})
    },
    {
      inputs: ["killStats","iconarray","generateResponsiveSvg","generateDots","totalAnimalsKilled","d3","color","wrap"],
      value: (function(killStats,iconarray,generateResponsiveSvg,generateDots,totalAnimalsKilled,d3,color,wrap)
{
 
  const data = killStats;
  const width = 850
  const chartWidth = 500
  const height = 470
  const margin = 50

  let layout = iconarray.layout()
  	.width(12);
  
  let dotCount = 144;
  let radius = 11;
  
  let svg = generateResponsiveSvg(width, height);
  let dataArray = generateDots(data, dotCount, totalAnimalsKilled);
  let grid = layout(dataArray);
  
  let arrayScale = d3.scaleLinear()
  	.domain([0, Math.sqrt(dataArray.length)])
  	.range([0+margin, chartWidth-margin]);
  
  svg.append("g")
    .attr("transform", "translate(" + margin + ", " + margin + ")");
  
  svg.selectAll('circle')
  	.data(grid)
		.enter()
	  .append('circle')
		.attr('cx', function(d){ 
			return arrayScale(d.position.x); 
		})
		.attr('cy', function(d){ 
			return height - arrayScale(d.position.y); 
		})
		.attr('r', radius)
		.attr('fill',function(d){ return d.data; })
  
  svg.append('g')
  .attr('transform','translate('+ (chartWidth)+',' + (height - 300) + ')')
	.selectAll('g.key-element')
	.data(data)
		.enter()
	.append('g')
		.attr('transform',function(d,i){ return 'translate(0,'+(i*60)+')'; })
		.attr('class','key-element')
	.call(function(parent){
		parent.append('circle')
			.attr('r', radius)
			.attr('cx', -radius*2)
			.attr('cy', -radius)	
  		.attr('fill', d => color(d.id))
		
		parent.append('text')
			.attr('dx', 0)
			.attr('dy', -0.4)
      .attr("style", "font-family: Roboto Condensed,sans-serif; font-size: 18px;")
			.text(d => d.label)
			.call(wrap, margin.right-20);
	})

  return svg.node();
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`The number of animals killed in shelters, in labs, or for fur and other uses is dwarfed by the scale of animal agriculture and factory farming. But this isn't reflected in the way people donate.`
)})
    },
    {
      inputs: ["md","totalAnimalsKilled","animalsKilledPerSecond","animalsKilledSincePageOpen"],
      value: (function(md,totalAnimalsKilled,animalsKilledPerSecond,animalsKilledSincePageOpen){return(
md`In the US alone, ${totalAnimalsKilled / 1e9} billion farmed animals were killed in 2015 – **equivalent to ${animalsKilledPerSecond.toFixed()} animals per second** (${Math.round(animalsKilledSincePageOpen).toLocaleString()} since you opened this page). The scale of this is hard to fathom; thanks to [scope insensitivity](https://en.wikipedia.org/wiki/Scope_neglect), our brains aren't up to the challenge of realising quite how enormous a number this is.`

)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`The below visualisation paints a dot for each animal killed – each one a creature capable of pain and emotion, not so unlike us humans.`
)})
    },
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
      inputs: ["md"],
      value: (function(md){return(
md`Helping these animals is within your power – there are [highly effective charities](https://animalcharityevaluators.org/donation-advice/recommended-charities/) working to improve welfare conditions in factory farms, and encourage individuals and companies to phase out animal products.

But if we want to make a difference, we have to put our money where it's needed.`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`<small>Data taken from [_Why Farmed Animals?_](https://animalcharityevaluators.org/donation-advice/why-farmed-animals/) by Animal Charity Evaluators.</small>`
)})
    },
    {
      name: "totalAnimalsKilled",
      value: (function(){return(
9.2e9
)})
    },
    {
      name: "animalsKilledSincePageOpen",
      inputs: ["Promises","animalsKilledPerSecond"],
      value: (function*(Promises,animalsKilledPerSecond)
{
  let i = 0;
  while (true) {
    yield Promises.delay(1000, i += (animalsKilledPerSecond));
  }
}
)
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
      name: "killStats",
      inputs: ["totalAnimalsKilled"],
      value: (function(totalAnimalsKilled)
{
  let stats = [
    {id: 1, label: "farmed animals", amount: (totalAnimalsKilled * 0.996)},
    {id: 2, label: "clothing", amount: (totalAnimalsKilled * 0.0007)},
    {id: 3, label: "lab animals", amount: (totalAnimalsKilled * 0.002)},
    {id: 4, label: "animal shelters", amount: (totalAnimalsKilled * 0.0003)}
  ]

  return stats.sort((a, b) => a.amount - b.amount)
}
)
    },
    {
      name: "donationStats",
      inputs: ["totalDonations"],
      value: (function(totalDonations)
{
  let stats = [
    {id: 1, label: "farmed animals", amount: totalDonations * 0.008},
    {id: 2, label: "other/mixed", amount: totalDonations * 0.32},
    {id: 3, label: "lab animals", amount: totalDonations * 0.007},
    {id: 4, label: "animal shelters", amount: totalDonations * 0.66}
  ]
  
  return stats.sort((a, b) => a.amount - b.amount)
}
)
    },
    {
      name: "animalShelterDonations",
      value: (function(){return(
1.2e9
)})
    },
    {
      name: "totalDonations",
      inputs: ["animalShelterDonations"],
      value: (function(animalShelterDonations){return(
(animalShelterDonations / 66) * 100
)})
    },
    {
      name: "color",
      inputs: ["d3"],
      value: (function(d3){return(
d3.scaleOrdinal(d3.schemeCategory10).domain([0,4])
)})
    },
    {
      name: "wrap",
      inputs: ["d3"],
      value: (function(d3){return(
function wrap(text, width) {
  
  //wrapping long labels https://bl.ocks.org/mbostock/7555321
  
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
)})
    },
    {
      name: "generateDots",
      inputs: ["color"],
      value: (function(color){return(
function(data, dotCount, total) {
  let dataArray = data.reduce(function(value, d) {
    let proportionOfDots = d.amount/total
    let numberOfDots = dotCount * proportionOfDots;

    for (var i = 0; i < Math.max(1,numberOfDots); i++) {
      value.push(color(d.id));
    }
    
    return value;
  }, []);

  while (dataArray.length > dotCount) {
    // additional dots have been added due to rounding, and need to be removed
    // find the biggest category, and drop dots until we have the right number

    dataArray.pop() // remove from the end of the array, as this is the category
    // which is the most numerous
  }

  return dataArray;
}
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
      name: "iconarray",
      inputs: ["require"],
      value: (function(require){return(
require("d3-iconarray")
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

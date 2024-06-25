const width = 1000;
const d3 = window.d3;

const margin = ({top: 40, right: 40, bottom: 40, left: 40});
const dx = 40;
const dy = width / 6;
const tree = d3.tree().nodeSize([dx, dy]);
const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

const createChart = (data) => {
  const root = d3.hierarchy(data);

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth > 5) d.children = null;
  });

  const svg = d3.create("svg")
      .attr("viewBox", [-margin.left, -margin.top, width - margin.left, dx])
      .style("font", "10px sans-serif")
      .style("user-select", "none");

  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 1.0)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(source) {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", d => {
          d.children = d.children ? null : d._children;
          update(d);
        });
    
    const folderClosed = '\uf07b';
    const pageIcon = '\uf0f6';
    
    const desat = (c) => d3.hsl(c.h, c.s, c.l + .0);

    // The circle
    nodeEnter.append("circle")
        .attr("r", dx / 3)
        .attr("fill", d => desat(d3.hsl(d.data['background-color'])))
        .attr("fill-opacity", 1)
        .attr("stroke", d => d.data['background-color'])
        .attr("data-target", d => d.data['data-target'] ? d.data['data-target'] : null)
        .attr("data-toggle", d => d.data['data-target'] ? 'modal' : null)
;
    // Icon for QA text
    nodeEnter
        .filter(d => d.data['data-target'])
        .append("text")
        .attr("x", -6)
        .attr("y", 6)
        .attr("font-family","FontAwesome")
        .attr('font-size', function(d) { return '16px';} )
        .attr('data-target', d => d.data['data-target'])
        .attr("data-toggle", 'modal')
        .text(pageIcon);
        ;


    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    
    // Link and text of each node
    const labels = nodeEnter
      .append("a")
        .attr('href', d => d.data.href)
      .append('text')
        .attr("dy", "0.31em")
        .attr("y", d => d._children ? '-2em' : 0)
        .attr("text-anchor", d => d._children ? "middle" : "start")
        .html(d => d.data.topic)
        .attr("x", d => d._children ? 0 : (dx / 3) + 4)
        ;
    window.setTimeout(() => labels.call(wrapText, 300), 0);
    
    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  return svg.node();
}

const wrapText = function (text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // em
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", this.getAttribute('x')).attr("y", y).attr("dy", dy + "em");
    console.log(words)
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      console.log(tspan.node().getComputedTextLength())
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
          .attr("x", this.getAttribute('x'))
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

window.createChart = createChart;

const dachart = createChart(mindData.data);
            document.getElementById('the-mindmap').append(dachart);
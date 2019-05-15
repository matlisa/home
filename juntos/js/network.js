var width = 800;
var height = 500;

var me = "#485b7c";
var you = "#ccd4e2";

var name = "Untitled";

var a = {"id":1, "group": me, "name":"Me", "connections":1},
	b = {"id":2, "group": you, "name":"You", "connections":1},
	c = {"id":3, "group": you, "name":"They", "connections":0},
	nodes = [a],
	l = {"source": 0, "target": 1, "type": 1, "value": 10},
	links = [];

/*
3 - material
2 - knowledge building
1 - emotional
4 - brokering
5 - institutional
*/
var support_type = {"res1": 3, "res2": 3, "teach": 2, "learn": 2, "feed": 2, "collab": 2,
"enc": 1, "talk": 1, "foll": 1, "recog": 1, "brok1": 4, "brok2": 4, "aca": 4, "car": 4,
"emp": 5, "aff": 5}

var svg = d3.select("#network").append("svg")
	.attr("width", width)
	.attr("height", height)

var color = d3.scaleOrdinal(["#ff548d", "#4286f4","#ffcd1c", "#8d1cff", "#28b783"]);
var color2 = d3.scaleOrdinal(["#b2cfff", "#afced3"]);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(100).strength(0.5))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

var link;
var node;
var text;

// d3.selectAll(".form-check-input").on("checked",function(d){
// 	console.log("step0")
// });

function setup() {

  link = svg.selectAll(".link")
    .data(links)
    .enter().append("path")
      .attr("class", "link")
      .style("stroke", function(d) { return color(d.type); });

  node = svg.selectAll(".node")
    .data(nodes.filter(function(d) { return d.id; }))
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("fill", function(d) { return color2(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  // node.append("title")
  //     .text(function(d) { return d.name; })

    // add a label to each node
	text = svg.selectAll(".label")
		.data(nodes.filter(function(d) { return d.id; }))
	    .enter().append("text")
		    .attr("class", "label")
		    .attr("dx", 12)
		    .attr("dy", ".35em")
			.attr("fill", function(d) { return color2(d.group); })
			.text(function(d) {
		        return d.name;
		    })

  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(links);

  function ticked() {
    link.attr("d", positionLink);
    node.attr("transform", positionNode);
    text.attr("transform", positionNode);
  }

  function tickActions() {
    //update circle positions each tick of the simulation
    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    text
    	.attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });

    //update link positions
    //simply tells one end of the line to follow one node around
    //and the other end of the line to follow the other node around
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }

}

function drawData(graph){

	nodes = nodes.concat(graph.nodes);
	links = links.concat(graph.links);

	// Apply the general update pattern to the links.
	link = link
	    .data(links)

    link.exit().remove();
    link = link.enter().append("path").attr("class", "link")
	    .style("stroke", function(d) { return color(d.type); })
	    .merge(link);

    // Apply the general update pattern to the nodes.
    node = node.data(nodes, function(d) { return d.id;});
    node.exit().remove();
    node = node.enter().append("circle")
    	.attr("fill", function(d) { return color2(d.group); })
    	.attr("r", 10)
    	.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
    	.merge(node);

   	text = text
	    .data(nodes, function(d) { return d.id;})

    text.exit().remove();
    text = text.enter().append("text")
		    .attr("dx", 12)
		    .attr("dy", ".35em")
			.attr("fill", function(d) { return color2(d.group); })
			.text(function(d) {
		        return d.name;
		    })
		    .merge(text);

    // Update and restart the simulation.
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

}

// https://bl.ocks.org/martinjc/7aa53c7bf3e411238ac8aef280bd6581
// links are drawn as curved paths between nodes,
// through the intermediate nodes
function positionLink(d) {
    var offset = d.type*15*(Math.pow(-1, d.type));

    var midpoint_x = (d.source.x + d.target.x) / 2;
    var midpoint_y = (d.source.y + d.target.y) / 2;

    var dx = (d.target.x - d.source.x);
    var dy = (d.target.y - d.source.y);

    var normalise = Math.sqrt((dx * dx) + (dy * dy));

    var offSetX = midpoint_x + offset*(dy/normalise);
    var offSetY = midpoint_y - offset*(dx/normalise);

    return "M" + d.source.x + "," + d.source.y +
        "S" + offSetX + "," + offSetY +
        " " + d.target.x + "," + d.target.y;
}

// move the node based on forces calculations
function positionNode(d) {
    // keep the node within the boundaries of the svg
    if (d.x < 0) {
        d.x = 0
    };
    if (d.y < 0) {
        d.y = 0
    };
    if (d.x > width) {
        d.x = width
    };
    if (d.y > height) {
        d.y = height
    };
    return "translate(" + d.x + "," + d.y + ")";
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x, d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x, d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null, d.fy = null;
}

var lastId = 1;

var addNode = function(){
  lastId++;
  var supports = [];

  d3.selectAll(".form-check-input").each(function(d){
  	cb = d3.select(this);
  	if(cb.property("checked")){
  		var type_input = cb.property("value");
    	supports.push({
    		"source": 0,
    		"target": lastId-1,
    		"type": support_type[type_input],
    		"value": 10
    	});
    }
  })

  $('.form-check-input').prop('checked', false);

  // console.log(supports)

  var newGraph = {
    nodes: [{
      id: lastId,
      group: you,
      name: d3.select("#name").property("value"),
      connections: 1
    }],
    links: supports
  };
  // console.log(newGraph);
  drawData(newGraph);
};

$(function(){
  setup();
  $("#addNode").click(addNode);

  $('#button-addon2').on('click', function () {
  	  name = $('#username').val();
  	  console.log($('#yourmap').text())
      var text = $('#yourmap');
      text.text(name+"'s Map");
  });

  $("#downloaddata").click(download);
});

function download() {
	goals = document.getElementById('exampleFormControlTextarea1').value;
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({goals, nodes, links}));
	var dlAnchorElem = document.getElementById('downloadAnchorElem');
	dlAnchorElem.setAttribute("href",     dataStr     );
	dlAnchorElem.setAttribute("download", name+".json");
	dlAnchorElem.click();
}

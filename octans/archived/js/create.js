var network = {
  // Start data
  graph: {
    "nodes":[
      {"id":1,"name":"You", "connections":1, "color": "#d3d3d3"}
    ],
    "links":[
    ]
  },
  // Graph design
  width: 960,
  height: 600,
  lines: {
		stroke: {
			color: "#d3d3d3",
			thickness: 2
		}
	},
	nodes: {
		fill: {
			color: "#d3d3d3"
		},
		stroke: {
			color: "#d3d3d3",
			thickness: 3
		},
		sizeRange: [10,75]
	},

	setup: function(){
	  // var $network = $("#network");
	  
	 //  $('<canvas/>').attr({
		// 	'id':'networkCanvas',
		// 	'width':this.width,
		// 	'height':this.height
		// }).appendTo($("#network"));
		
		this.svg = d3.select("#network").append("svg")
			.attr("width", this.width)
			.attr("height", this.height)

		// this.canvas = document.getElementById('networkCanvas');
		// this.context = this.canvas.getContext('2d');
		
		this.simulation = d3.forceSimulation()
			.stop()
			.force("link",d3.forceLink().id((d)=>{return d.id}))
			.force("change",d3.forceManyBody())
			.force("center",d3.forceCenter())
			// .force("collide",d3.forceCollide().radius((d)=>{return d.force;}).iterations(2))
			// .on("tick",()=>{
			// 	this.ticked();
			// });

    		this.drawData(this.graph);

	},
	// forceScale: function(node){
 //    var scale = d3.scaleLog().domain(this.nodes.sizeRange).range(this.nodes.sizeRange.slice().reverse());
 //    return node.r + scale(node.r);
	// },

	drawData: function(graph){
	 //  var countExtent = d3.extent(graph.nodes,function(d){return d.connections}),
		// 		radiusScale = d3.scalePow().exponent(2).domain(countExtent).range(this.nodes.sizeRange);

  //   // Let D3 figure out the forces
		// for(var i=0,ii=graph.nodes.length;i<ii;i++) {
		// 	var node = graph.nodes[i];

		// 	node.r = radiusScale(node.connections);
		// 	node.force = this.forceScale(node);
		// };

    // Add new data to old data
		this.graph.nodes = this.graph.nodes.concat(graph.nodes);
		this.graph.links = this.graph.links.concat(graph.links);

		console.log(this.graph)


	// add svg elements???
		var link = this.svg.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(this.graph.links)
			.enter().append("line");

		var node = this.svg.append("g")
			.attr("class", "nodes")
			.selectAll("circle")
			.data(this.graph.nodes)
			.enter().append("circle")
			.attr("r", 30)
			.call(d3.drag()
				.on("start", this.dragstarted(this.simulation))
				.on("drag", this.dragged)
				.on("end", this.dragedned));

    // Feed to simulation
		this.simulation
			.nodes(this.graph.nodes)
			.on("tick", this.ticked);

		this.simulation.force("link")
			.links(this.graph.links);

		this.simulation.alpha(0.3).restart();
	},
dragstarted: function(d, simulation) {
	console.log(d)
	console.log(simulation)
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x, d.fy = d.y;
},
dragged: function(d) {
  d.fx = d3.event.x, d.fy = d3.event.y;
},
dragended: function(d, simulation) {
  if (!d3.event.active) this.simulation.alphaTarget(0);
  d.fx = null, d.fy = null;
},
	ticked: function(){


	  if(!this.graph) {
			return false;
		}

	this.link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    this.node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
	    // TEST
	 //    this.simulation.selectAll(".link").attr("d", positionLink);
	 //    this.simulation.selectAll(".node").attr("transform", positionNode);

		// function positionLink(d) {
		//   return "M" + d[0].x + "," + d[0].y
		//        + "S" + d[1].x + "," + d[1].y
		//        + " " + d[2].x + "," + d[2].y;
		// }

		// function positionNode(d) {
		//   return "translate(" + d.x + "," + d.y + ")";
		// }
		// TEST

		// this.context.clearRect(0,0,this.width,this.height);
		// this.context.save();
		// this.context.translate(this.width / 2, this.height / 2);

		// this.context.beginPath();
		// this.graph.links.forEach((d)=>{
		// 	this.context.moveTo(d.source.x, d.source.y);
		// 	this.context.lineTo(d.target.x, d.target.y);
		// });
		// this.context.strokeStyle = this.lines.stroke.color;
		// // this.context.strokeStyle = "d3d3d3"
		// this.context.lineWidth = this.lines.stroke.thickness;

		// this.context.stroke();
		
		// this.graph.nodes.forEach((d)=>{
		// 	this.context.beginPath();
			
		// 	this.context.moveTo(d.x + d.r, d.y);
		// 	this.context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
		// 	this.context.fillStyle = d.colour;
		// 	// this.context.strokeStyle =this.nodes.stroke.color;
		// 	this.context.lineWidth = this.nodes.stroke.thickness;
		// 	this.context.fill();
		// 	this.context.stroke();
		// });
	
		// this.context.restore();
	}
	
  
};

var lastId = 1;

var addNode = function(){
  lastId++;
  var newGraph = {
    nodes: [{
      name: d3.select("#name").property("value"),
      id: lastId,
      colour: "lightblue",
      connections: 1
    }],
    links: [{
      source: 1,
      target: lastId
    }]
  };
  // console.log(newGraph);
  network.drawData(newGraph);
};

$(function(){
  network.setup();
  
  $("#addNode").click(addNode);
});

/*
function setup() {
	var width = 960,
	    height = 500;

	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .on("mousemove", mousemove)
	    .on("mousedown", mousedown);

	svg.append("rect")
	    .attr("width", width)
	    .attr("height", height);

	var links = d3.forceLink()
	var force = d3.forceSimulation()
		.nodes([{}])
	    .force("link", links)
	    .force("charge", d3.forceManyBody())
	    .force("center", d3.forceCenter(width / 2, height / 2))
	    .on("tick", tick)



	// var force = d3.layout.force()
	//     .size([width, height])
	//     .nodes([{}]) // initialize with a single node
	//     .linkDistance(30)
	//     .charge(-60)
	//     .on("tick", tick);

	// var link = svg.append("g")
	//     .attr("class", "links")
	//     .selectAll("line")
	//     .data([{}])
	//     .enter().append("line");

	// var node = svg.append("g")
	// 	.attr("class", "nodes")
	// 	.selectAll("circles")
	// 	.data([{}])
	// 	.enter().append("circle")
	// 	.attr("r", 2.5)


    // force.force("link")
    //     .links(graph.links);



	var nodes = force.nodes(),
	    node = svg.selectAll(".node"),
	    link = svg.selectAll(".link");

	var cursor = svg.append("circle")
	    .attr("r", 30)
	    .attr("transform", "translate(-100,-100)")
	    .attr("class", "cursor");

	restart();

	function mousemove() {
	  cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
	}

	function mousedown() {
	  var point = d3.mouse(this),
	      node = {x: point[0], y: point[1]},
	      n = nodes.push(node);

	  // add links to any nearby nodes
	  nodes.forEach(function(target) {
	    var x = target.x - node.x,
	        y = target.y - node.y;
	    if (Math.sqrt(x * x + y * y) < 30) {
	      links.push({source: node, target: target});
	    }
	  });

	  restart();
	}

	function tick() {
	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node.attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	}

	function restart() {
	  // link = link.data(links);

	  link.enter().insert("line", ".node")
	      .attr("class", "link");

	  node = node.data(nodes);

	  node.enter().insert("circle", ".cursor")
	      .attr("class", "node")
	      .attr("r", 5)
	      // .call(force.drag);

	  force.restart();
	}
}

// TODO
// function setup() {
// 	var width = 960;
// 	var height = 600;

// 	var svg = d3.select("#network")
// 		.append("svg")
// 		.attr("width", width)
// 		.attr("height", height);

// 	var force = d3.forceSimulation()
// 	    .force("link", d3.forceLink().id(function(d) { return d.id; }))
// 	    .force("charge", d3.forceManyBody())
// 	    .force("center", d3.forceCenter(width / 2, height / 2));
// }

// function addNode() {
//   var newGraph = {
//     nodes: [{
//       name: "Name-"+(++lastId),
//       id: lastId,
//       colour: getRandomColor(),
//       connections: 1
//     }],
//     links: [{
//       source: 1,
//       target: lastId
//     }]
//   };
//   // console.log(newGraph);
//   network.drawData(newGraph);
// };

$(function(){
  setup();
  $("#addNode").click(addNode);
});

*/
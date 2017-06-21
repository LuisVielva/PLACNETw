var nFicherosPorLeer = 5;
function cosasDespues()
{
	nFicherosPorLeer = nFicherosPorLeer - 1;
	if (nFicherosPorLeer > 0) return;

	// Etiquetamos los nodos con la información adicional
	for (var k=0; k < relax.length; k++)
	{
		if (hNode.hasOwnProperty(relax[k].node))
		{
			nodes[hNode[relax[k].node]].rel = relax[k].hit; 
			nodes[hNode[relax[k].node]].relp = relax[k].percentage; 
		}
	}
	for (var k=0; k < inc.length; k++)
	{
		if (hNode.hasOwnProperty(inc[k].node))
		{
			nodes[hNode[inc[k].node]].inc = inc[k].hit; 
			nodes[hNode[inc[k].node]].incp = inc[k].percentage; 
		}
	}	
	for (var k=0; k < rip.length; k++)
	{
		if (hNode.hasOwnProperty(rip[k].node))
		{
			nodes[hNode[rip[k].node]].rip = rip[k].hit;
			nodes[hNode[rip[k].node]].ripp = rip[k].percentage; 
		}
	}
	
	// Construimos la info del node, que depende del name y de los atributos
	for (var k = 0; k < nodes.length; k++)
	{
		nodes[k].info = nodeInfo(nodes[k]);
	}
	
	var bcr = Ext.getElementById('idCenterRegion').getBoundingClientRect();
	force = d3.layout.force()
			.nodes(nodes)
			.links(links)
			.charge(-120)
			.linkDistance(30)
			// .size([1.5*bcr.width, 1.5*bcr.height])
			.on("tick", _tick) 		
			.on("end", function() {	fixGraph(true);	});		
			
	forceDragInit();	
		
	updateEnterExit();
	force.start();

	_neighborUpdate();
}

function _tick()
{
	link.attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; });
	
	node.attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; });
}	

function nodeInfo(d)
{ 
	if (d.group == 1) 
	{
		var _txt = "Node: " + d.numero + ", Length: " + d.longitud + ", Coverage: " + d.coverage;
        if (d.hasOwnProperty('rel')) _txt = _txt + ' REL (' + d.rel + ', ' + d.relp + '%)';
        if (d.hasOwnProperty('inc')) _txt = _txt + ' Inc (' + d.inc + ', ' + d.incp + '%)';
        if (d.hasOwnProperty('rip')) _txt = _txt + ' RIP (' + d.rip + ', ' + d.ripp + '%)';
        
        return _txt;		
	} 

	var name = d.name.split('|')[3].split('.')[0];
	return referenceHeader.hasOwnProperty(name) ? (name + ' ' + referenceHeader[name]) : name;
}

function updateEnterExit()
{			
	_updateEnterExitLinks();
	_updateEnterExitNodes();
	_treeUpdate();
}	

function _updateEnterExitLinks()
{
	link = svg.selectAll(".link").data(links, function(d) { return d.source.name + "-" + d.target.name; });
	
	// Update section 
	link.attr("id", function(d) { return _idLink(d); });
		
	// Enter section
 	link.enter().append("line")
		.attr("class", "link")
		.attr("id", function(d) { return _idLink(d); })
		.style("stroke-dasharray", function(d) { return d.value == 1 ? "" : "7,7"; })
		.on("click", function(d) { onClickLine(d); });
			
	// Exit section
	link.exit().remove();
}

function _updateEnterExitNodes()
{
	node = svg.selectAll(".node").data(nodes, function(d) { return _idNode(d); } );
	
	// Update section
	node.attr("id", function(d) { return _idNode(d); });
	
	// Enter section
	node.enter().append("circle")
		.attr("class", "node")
		.attr("r", function(d) { return rango.radio(d.longitud); })
		.attr("id", function(d) { return "node." + d.name; })    // attr("id", function(d) { return "node." + d.index; })
		.attr("longitud", function(d) { return d.longitud; })
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
		.style("fill", function(d) { return _getColor(d); })
		.on("mouseover", function(d) { onMouseOver(d); })
		.on("mouseout", function(d) { onMouseOut(d); })
		.on("click", function(d) { onClickNode(d); })
		.on("dblclick", onDblClick)
		.call(forceDrag);                             // era .call(force.drag); que movia por defecto los nodos
		

	node.append("title").text(function(d){ return d.info; });
	
	// Exit section
	node.exit().remove();
}

// hit: naranja
// contig: azul ó
// rel: rojo, rip: amarillo, rel+rip: verde 
function _getColor(d)   
{
	if (d.group == 2) return '#ff7f0e';
	if (d.hasOwnProperty('rel'))
	{	
		return d.hasOwnProperty('rip') ? '#2ca02c' : '#d62728';
	}
	return d.hasOwnProperty('rip') ? '#bcbd22' : '#1f77b4';
}

function _getIconCls(d)   
{
	if (d.hasOwnProperty('rel'))
	{	
		return d.hasOwnProperty('rip') ? 'verde' : 'rojo';
	}
	return d.hasOwnProperty('rip') ? 'amarillo' : '';
}

function fixGraph(v)
{	
	for (var k = 0; k < nodes.length; k++)
	{
		nodes[k].fixed = v;
	}
}
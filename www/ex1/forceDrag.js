var forceDrag;

function forceDragInit()
{
	forceDrag = force.drag()
    			.on("dragstart", forceDragStart)
    			.on("drag", forceDragDragged)
                .on("dragend", forceDragEnd);
	
}

var coseleccionados;
function forceDragStart(d, n, p) 
{
	// Para evitar que al mover un nodo y luego mover otro se mueva tambien el primero
	coseleccionados = (node[0][n].getAttribute("class") == "nodeSelected") ? 
	                  d3.selectAll(".nodeSelected").attr("fixed", false).data() : [];
}

function forceDragDragged(d, n, p) 
{
	for (var k = 0; k < coseleccionados.length; k++)
	{
		coseleccionados[k].x = coseleccionados[k].px = coseleccionados[k].x + d3.event.dx;
		coseleccionados[k].y = coseleccionados[k].py = coseleccionados[k].y + d3.event.dy;
	}
	// force.start();
}

function forceDragEnd(d, n, p)
{
	// force.stop();
}
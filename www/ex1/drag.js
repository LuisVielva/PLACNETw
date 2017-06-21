// Tenemos dos modos de funcionamiento del drag: 
// i) Sin apretar Alt traslada el elemento _svgScale
// ii) Apretando Alt mueve un cuadrado de seleccion (hay que ver como se comporta cuando el _svgScale esta rotado)

var _dragSelect = false;
var _panx = 0, _pany = 0;
var _drag; 
var _dragx = 0, _dragy = 0;
var _rectSelection;

function draginit()
{
	var bcr = Ext.getElementById('idCenterRegion').getBoundingClientRect();
	Translate(0.5*bcr.width, 0.5*bcr.height);

	_drag = d3.behavior.drag()
    // .origin(function(d) { console.log(["origin", d]); return d; })
    .on("dragstart", _dragstarted)
    .on("drag", _dragged)
    .on("dragend", _dragended);
	
	d3.select("#fondo").call(_drag);
	
	_rectSelection = Ext.getElementById("rectSelection");
}

function _dragstarted(d) 
{
	_dragSelect = d3.event.sourceEvent.altKey ||
	              d3.event.sourceEvent.ctrlKey ||
	              d3.event.sourceEvent.shiftKey ||
	              d3.event.sourceEvent.metaKey;
	
	if (_dragSelect)
	{
		_dragx = d3.event.sourceEvent.offsetX;
		_dragy = d3.event.sourceEvent.offsetY;
		_rectSelection.setAttribute("x", _dragx);
		_rectSelection.setAttribute("y", _dragy);
	}
	else
	{
		// Era x e y, que en Chrome funciona pero en FF no, asi que pasamos todo a pageX y pageY
		_dragx = d3.event.sourceEvent.pageX; 
		_dragy = d3.event.sourceEvent.pageY;
	}
	
	//d3.event.sourceEvent.stopPropagation();
 	//d3.select(this).classed("dragging", true);
}

function _dragged(d) 
{
	if (_dragSelect)
	{
		_rectSelection.setAttribute("x", Math.min(_dragx, d3.event.x));
		_rectSelection.setAttribute("y", Math.min(_dragy, d3.event.y));
		_rectSelection.setAttribute("width", Math.abs(d3.event.x - _dragx));
		_rectSelection.setAttribute("height", Math.abs(d3.event.y - _dragy));
		__collisionCircleRect();
		__collisionLineRect();
	}
	else
	{
		// Era x e y, que en Chrome funciona pero en FF no, asi que pasamos todo a pageX y pageY
		Translate(d3.event.sourceEvent.pageX - _dragx, d3.event.sourceEvent.pageY - _dragy);
		_dragx = d3.event.sourceEvent.pageX; 
		_dragy = d3.event.sourceEvent.pageY;
	}
}

function _dragended(d) 
{
	if (_dragSelect)
	{
		svg.selectAll(".nodePreSelected").attr("class", "nodeSelected");
		svg.selectAll(".linkPreSelected").attr("class", "linkSelected");
		
		_rectSelection.setAttribute("width", 0);
		_rectSelection.setAttribute("height", 0);
	}
}

function Translate(x, y)
{
	_panx += x;
	_pany += y;
	
	ApplyTransform();
}
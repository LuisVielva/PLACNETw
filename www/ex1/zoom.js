var _currentScale = 1;
var _scaleMin = 0.2;
var _scaleMax = 2;
var _zoom; 

function zoominit()
{
	_zoom = d3.behavior.zoom()
    .scaleExtent([_scaleMin, _scaleMax])
    .on("zoom", _zoomed);
		
	d3.select("#fondo").call(_zoom);
}

function _zoomed() 
{
	_Zoom(d3.event.scale);
}

function ZoomIn()
{
	_Zoom(Math.min(_scaleMax, _currentScale + 0.05));
	_zoom.scale(_currentScale); 
}

function ZoomOut()
{
	_Zoom(Math.max(_scaleMin, _currentScale - 0.05));
	_zoom.scale(_currentScale);
}

function _Zoom(f)
{
	_currentScale = f;
	ApplyTransform();
}
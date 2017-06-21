function _idLink(d)
{
	return "link." + d.source.name + "." + d.target.name;
}

function numberOfSelectedLinks()
{
	return svg.selectAll(".linkSelected").data().length
}

function _unselectLinks()
{
	svg.selectAll(".linkSelected").attr("class", "link");
}

function onClickLine(d)
{
	var elemento = document.getElementById(_idLink(d));
	var estabaSeleccionado = (elemento.getAttribute("class") == "linkSelected");
	var seleccionado = !estabaSeleccionado;
	
	if (seleccionado && !d3.event.altKey && !d3.event.ctrlKey && !d3.event.shiftKey && !d3.event.metaKey)
	{
		_unselectLinks();
	}
	elemento.setAttribute("class", seleccionado ? "linkSelected" : "link");
}

function __deleteLink(d)
{
	var t = [];
	
	t.push({tipo: 'd', link: links.splice(links.indexOf(d), 1)[0]});
	
	// Al borrar el enlace, podrian quedar referencias aisladas
	if (_isIsolatedReference(d.source)) t.push({tipo: 'D', node: nodes.splice(nodes.indexOf(d.source), 1)[0]});	
	if (_isIsolatedReference(d.target)) t.push({tipo: 'D', node: nodes.splice(nodes.indexOf(d.target), 1)[0]});
	
	return t;
}
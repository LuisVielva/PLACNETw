function _idNode(d)
{
	// return "node." + d.index;
	return "node." + d.name;
}

function _unselectNodes()
{
	svg.selectAll(".nodeSelected").attr("class", "node");
}

function _showNodeInfo(d)
{
	tituloIrene.innerHTML = AppName + ((d === null) ? '' : d.info);

	/*
	Pasa un error extrano en Chrome bajo windows 8, vuelve el foco a la primera posicion del arbol
	_extLayoutBorder.setTitle
	(
		AppName + ((d === null) ? '' : d.info)
	);
	*/
}

function numberOfSelectedNodes()
{
	return svg.selectAll(".nodeSelected").data().length
}

function onMouseOver(d)
{
	_showNodeInfo(d);
}    

function onMouseOut(d)
{
	_showNodeInfo(null);
}

function _showChildren(d)
{
	var _treeNode = _extTree.getStore().findNode("text", d.info);
	
	// Me gustaria, pero al seleccionar un nodo, su hijo y el nodo otra vez, da error
	// _extTree.collapseAll();
	
	// Cargamos dinamicamente los hijos
	if (!_treeNode.hasChildNodes())
	{
		var r = _referencesOfNode(d);
		for (var i = 0; i < r.length; i++)
		{
			_treeNode.appendChild
			(
				{
					text: r[i].info,
					node: r[i],
					leaf: true
				}
			)
		}
	}
	
	_extTree.getSelectionModel().select(_treeNode);
	_extTree.getView().expand(_treeNode);
	_extTree.getView().focusRow(_treeNode);	
}

function onClickNode(d)
{
	var elemento = document.getElementById(_idNode(d));
	var estabaSeleccionado = (elemento.getAttribute("class") == "nodeSelected");
	var seleccionado = !estabaSeleccionado;
	
	if (seleccionado && !d3.event.altKey && !d3.event.ctrlKey && !d3.event.shiftKey && !d3.event.metaKey)
	{
		_unselectNodes();
	}
	elemento.setAttribute("class", seleccionado ? "nodeSelected" : "node");
	
	if (d.group == 1)
	{
		_showChildren(d);
	}
}

function _selectNodeFromTree(d)
{	
	svg.selectAll(".nodeSelected").attr("class", "node");
	document.getElementById("node." + d.name).setAttribute("class", "nodeSelected");
	
	if (d.group == 1)
	{
		_showChildren(d);	
	}
	
	if (d.group == 2)
	{
		var sm = _extTree.getSelectionModel();
	 	var _treeNode = sm.getSelection()[0];
	 	var _parentNode = _treeNode.parentNode;
	 	var _node = _treeNode.data.node;

		_getContigInReferenceInfo
		(
			'NODE_' + _parentNode.data.node.numero, 
			d.info.split(' ')[0], // "NZ_CP007135 Escherichia coli O145..."
			unique
		);
	}
}

// The second parameter of filter will set "this" inside of the callback.
// Consultar:
// http://stackoverflow.com/questions/7759237/how-do-i-pass-an-extra-parameter-to-the-callback-function-in-javascript-filter
function _isNodeExtremeOfLink(l)
{
	return l.source == this || l.target == this;
}

// Enlaces de un nodo
function _linksOfNode(d)
{
	return links.filter(_isNodeExtremeOfLink, d);
}

// Dado un enlace "l" que tiene al nodo "n" como extremo, devuelve el otro extremo 
function _otherExtreme(l, n)
{
	return (l.source == n) ? l.target : l.source;
}

// Dice si un nodo es una referencia aislada
function _isIsolatedReference(n)
{
	return n.group == 2 && !links.some(_isNodeExtremeOfLink, n);
}

// Devuelve las referencias de un nodo
function _referencesOfNode(d)
{
	if (d.group == 2) return [];
	
	var r = [];
	_linksOfNode(d).forEach
	(
		function(value)
		{
			var n = _otherExtreme(value, d);
			if (n.group == 2)
			{
				r.push(n);
			}
		}
	)
	
	return r;
}

function _angleBetweenNodes(source, target)
{
	return Math.atan2(target.y-source.y, target.x-source.x)*180/Math.PI
}

// Al borrar un nodo debo eliminar los enlaces que lo tienen como extremo y las referencias que se queden aisladas
function __deleteNode(d)
{
	var t = [];

	// Elimino el nodo seleccionado	
	t.push({tipo: 'D', node: nodes.splice(nodes.indexOf(d), 1)[0]});
	
	// Obtengo los enlaces que lo tienen como extremo
	var l = _linksOfNode(d);
	
	// Elimino los enlaces
	l.forEach
	( 
		function(value) 
		{ 
			t.push({tipo: 'd', link: links.splice(links.indexOf(value), 1)[0]}); 
		} 
	);
	
	// Obtengo los otros extremos de los enlaces y los elimino si son referencias aisladas
	l.forEach
	(
		function(value)
		{
			var n = _otherExtreme(value, d);
			if (_isIsolatedReference(n))
			{
				t.push({tipo: 'D', node: nodes.splice(nodes.indexOf(n), 1)[0]});
			}
		}
	)
			
	return t;
}

function cloneNode(d)
{
	var t = []; // transaccion
	var l = _linksOfNode(d); // Obtengo los enlaces del nodo
	
	// Creamos un nuevo nodo identico al antiguo
	var n = new Node(d);
	n.name += '.2';  // += (0|Math.random()*9e6).toString(36);
	n.info += '.2';
	d.info += '.1';
	
	// nodes.splice(nodes.indexOf(d) + 1, 0, n);
	nodes.push(n);
	
	t.push({tipo: 'I', node: n});
	
	for (k = 0; k < l.length; k++)
	{
		var o = _otherExtreme(l[k], d);
		var nl = new Edge(n, o, l[k].value);
		links.push(nl);
		t.push({tipo: 'i', link: nl});
	}
		
	updateEnterExit();
	
	_tUndo.push(t);
}
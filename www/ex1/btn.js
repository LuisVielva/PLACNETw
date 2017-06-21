function _btnUnselectAll()
{
	_unselectNodes();		
	_unselectLinks();
}

function _btnPause()
{
	force.stop();
}

function _btnPlay()
{
	fixGraph(false);
	force.start();	
}

function _btnSelectContigs()
{	
	Ext.MessageBox.show
	(
		{
   			title: 'Select contigs by node length', 
   			msg: 'From: <input id="filterFrom" type="number" min="0" value="200"/>&nbsp;&nbsp; ' +
   			     'To: <input id="filterTo" type="number" min="0" step="10" value="5000"/> (bp)',
   			buttons:  Ext.MessageBox.OKCANCEL,
   			fn: function(btn) 
   			{
      			if( btn == 'ok') 
      			{
      				var from = Ext.get('filterFrom').getValue();
      				var to   = Ext.get('filterTo').getValue();

					addLog('Selected contigs by node length from ' + from + ' to ' + to);
					svg.selectAll("circle").select
					(
						function(d, i)
						{
							return (d.group == 1 && d.longitud >= from && d.longitud <= to) ? this : null
						}
					).attr("class", "nodeSelected");
				}
			}
		}
	);
}

function _btnSelectReferences()
{	
	Ext.MessageBox.prompt
	(
		'Select references by name', 
		'Please enter substring to search:', 
		function(btn, text)
		{
			if (btn == 'ok')
			{
				addLog('Selected references by substring ' + text);
				for (var k = 0; k < nodes.length; k++)
				{
					if (nodes[k].group == 2 && nodes[k].info.indexOf(text) != -1)
					{
						node[0][k].setAttribute("class", "nodeSelected");
					}
				}
			}
		}, 
		this
	);
}

function _btnInfo()
{
	var sl = svg.selectAll(".linkSelected").data();
	var sn = svg.selectAll(".nodeSelected").data();
	var nContigs = 0; 
	var nReferences = 0;
	var longitudTotal = 0;
	
	for (var k = 0; k < sn.length; k++)
	{
		if (sn[k].group == 1)
		{
			nContigs++;
			longitudTotal += sn[k].longitud;
		}
		else
		{
			nReferences++;
		}
	}
	
	Ext.MessageBox.alert
	(
		'Information on current selection', 
		'There are ' + sl.length + ' links and ' +
		sn.length + ' nodes (' + nContigs + ' contigs and ' + nReferences + ' references) selected.' +
		'<p> The total length of the contigs is ' + longitudTotal + ' bp'
    );
}

function _btnZoomIn()
{
	ZoomIn();
}

function _btnZoomOut()
{
	ZoomOut();
}

var _currentAngle = 0;
function _btnRotate(theta)
{
	_currentAngle += theta;
	ApplyTransform();
}

function _btnClone()
{
	var data = svg.selectAll(".nodeSelected").data();
	var nosn = data.length;
	if (nosn == 1)
	{
		_unselectNodes();
		_unselectLinks();
		cloneNode(data[0]);
		addLog('Clone node ' + data[0].name);
	}
	else
	{
		Message
		(
			'<p>One and only one node has to be selected in order to be cloned</p><p>(there are ' 
	        + nosn + ' nodes currently selected)</p>'
       	);
	}
}

function _btnAddLink()
{
	var data = svg.selectAll(".nodeSelected").data();
	if (data.length != 2)
	{
		Message('<p>Two unlinked nodes have to be selected (at least one of them a contig)</p>');
		return
	}
	if (data[0].group == 2 && data[1].group == 2)
	{
		Message('<p>At least one of the nodes has to be a contig node</p>');
		return;
	}
	_neighborUpdate();
	if (sonVecinos(data[0], data[1]))
	{
		Message('<p>The selected nodes are already linked</p>');
		return;
	}
	
	// Si un nodo es referencia, entonces es el target
	var source = (data[0].group == 2) ? data[1] : data[0];
	var target = (data[0].group == 2) ? data[0] : data[1];
	var link = new Edge(source, target, target.group);

	_btnUnselectAll();
	links.push(link);
	updateEnterExit();	
	addLog('New link from ' + source.name + ' to ' + target.name);
	_tUndo.push([{tipo: 'i', link: link}]);
}

function _btnDelete()
{
	var sl = svg.selectAll(".linkSelected").data();
	var sn = svg.selectAll(".nodeSelected").data();
	
	if (sn.length == 0 && sl.length == 0)
	{
		Message('There are not nodes or links selected');
		return;
	}
	else
	{
		_unselectNodes();
		_unselectLinks();
	}
	
	var transaccion = [];	
	for (var k = 0; k < sn.length; k++)
	{
		addLog('Delete node ' + sn[k].name);
		transaccion.push.apply(transaccion, __deleteNode(sn[k]));
	}
	for (var k = 0; k < sl.length; k++)
	{
		addLog('Delete link from ' + sl[k].source.name + ' to ' + sl[k].target.name);
		transaccion.push.apply(transaccion, __deleteLink(sl[k]));
	}	
	if (transaccion.length > 0)
	{
		_tUndo.push(transaccion);
		updateEnterExit();
	}
}

function _btnUndo()
{
	force.stop();
	_unselectNodes();		
	_unselectLinks();
	_undo(); 
}

function _btnSaveAll()
{
	addLog('Network saved');
	saveAll(unique);
}

function _btnHome()
{
	Ext.MessageBox.confirm
	(
		"Confirmation", 
		"All changes will be lost. Do you want to load the initial network state?", 
		function(btnText)
		{
			if (btnText === "yes")
			{
				addLog('Original version loaded');
				window.location.search += '&redfile=red0.csv';
				// Cargamos la version original
			}
    	}, 
    	this
    );
}

function _btnDownload()
{
	// Un array de componentes conexas. Cada componente es un array de indices de nodos en el array nodes
	var cc = _connectedComponents();
	var cs = [];
	
	// Convertimos esos indices a los numeros originales de los nodos (puede haber duplicados, borrados, ...)
	// Tendremos un array con una componente por cada componente conexa que tiene un string con la lista de nodos
	for (var k = 0; k < cc.length; k++)
	{
		for (var n = 0; n < cc[k].length; n++)
		{
			cc[k][n] = nodes[cc[k][n]].numero;
		}
		cs[k] = cc[k].toString().replace(/,/g, ' ');
	}
	
	// Obtenemos el svg
	var svgAsString = getSvgAsString();
	
	_getZipFile(cs, svgAsString, unique);
	
	addLog('Results downloaded');
}
// El undo se implementa mediante un array en el que cada elemento representa una transaccion que es a su vez una array
// de operaciones delete ("d"), insert ("i") o update ("u")
// Si son minusculas son enlaces, si son mayusculas son nodos

var _tUndo = [];

// Recibe una transaccion, que es un array de operaciones 
function _setUndo(t)
{
	_tUndo.push(t);
}

function _undo()
{	
	var t = _tUndo.pop(); // transaccion
	if (typeof t != "undefined")
	{
		for (var k = t.length - 1; k >= 0; k--)
		{
			switch (t[k].tipo)
			{
				// Enlaces
				case 'd':
				    addLog('Undo: undeleted link from ' + t[k].link.source.name + ' to ' + t[k].link.target.name);
					links.push(t[k].link);
					break;
				case 'i':
				    addLog('Undo: removed link from ' + t[k].link.source.name + ' to ' + t[k].link.target.name);
				    links.splice(links.indexOf(t[k].link));
					break;
				case 'u': 
					replaceNodeInLink(t[k].link, t[k].nodeNew, t[k].nodeOld);
					break;
	
				// Nodos
				case 'D':
				    addLog('Undo: undeleted node ' + t[k].node.name);
					nodes.push(t[k].node);
					break;
				case 'I':
				    addLog('Undo: removed node ' + t[k].node.name);
					nodes.splice(nodes.indexOf(t[k].node));
					break;
				case 'U': 
					break;
			}
		}
		
		updateEnterExit();
		_tick();
	}
	else
	{
		Message('The undo Queue is empty');
	}
}
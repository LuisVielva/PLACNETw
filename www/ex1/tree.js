function _treeLoad()
{  
	// Este beginUpdate y el endUpdate deberia ser por eficiencia (hay que comprobarlo)
	var _store = _extTree.getStore();
	_store.beginUpdate();
	
	var _root = _extTree.getRootNode();
	for (var k = 0; k < nodes.length; k++)
	{
		if (nodes[k].group == 1)
		{
			// var r = _referencesOfNode(nodes[k]);
			var c = _root.appendChild
			(
				{
					text: nodes[k].info,
					node: nodes[k],
					cls: 'info',
					iconCls: _getIconCls(nodes[k]),
					leaf: false //(r.length == 0)
				}
			);	
			
			/* Los hijos no los cargamos ahora, sino dinamicamente cuando hace falta
			   asi podemos destruir y recargar el arbol mas rapido para sincronizar
			   los delete, clone y undo
			// var r = _referencesOfNode(nodes[k]);
			for (var i = 0; i < r.length; i++)
			{
				c.appendChild
				(
					{
						text: r[i].info,
						node: r[i],
						leaf: true
					}
				)
			}
			*/
		}
	}
	
	_store.endUpdate();
}

function _treeDelete()
{
	_extTree.getRootNode().removeAll();
}

function _treeUpdate()
{
	_treeDelete();
	_treeLoad();
}
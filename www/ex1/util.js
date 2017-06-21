function stTranslate(x,y)
{
	return "translate(" + x + ", " + y + ")";
}

function stRotate(theta)
{
	return "rotate(" + theta + ")";
}

function stTranslateRotate(x,y,theta)
{
	return stTranslate(x,y) + " " + stRotate(theta);
}

function replaceNodeInLink(link, nodeOld, nodeNew)
{
	if (link.source == nodeOld) link.source = nodeNew; else link.target = nodeNew;
}

// Longitud maxima y minima de contig para ajustar linealmente los radios de los nodos
function Rango(node)
{
	lMax = 0;
	for (var n = 0; n < node.length; n++)
	{			
		lMax = Math.max(lMax, node[n].longitud);
	}

	this.radio = d3.scale.linear().domain([0, 20000, lMax]).range([5, 20, 25]);
}

// Lee parametros de la url, lo utilizamos para obtener el unique que se envia al usuario
function getQueryVariable(variable)
{
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	
	for (var i = 0; i < vars.length; i++) 
	{
		var pair = vars[i].split("=");
		
		if (pair[0] == variable)
		{
			return pair[1];
		}
	}
	
	return false;
}
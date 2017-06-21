//Create a hash table logging what is connected to what
var linkedByIndex = {};

function _neighborUpdate()
{
	linkedByIndex = {};
	nodes.forEach
	(
		function (d)
		{
			linkedByIndex[d.index + ',' + d.index] = 1;
		}
	);

	links.forEach
	(
		function (d) 
		{
    		linkedByIndex[d.source.index + "," + d.target.index] = 1;
		}
	);
}

//This function looks up whether a pair are neighbours
function neighboring(a, b) 
{
    return linkedByIndex[a.index + "," + b.index];
}

function sonVecinos(a, b)
{
	return neighboring(a, b) || neighboring(b, a);
}

var __vecino;
function onDblClick() 
{
	_neighborUpdate();
	__vecino = d3.select(this).node().__data__;
	node.filter(esVecino).attr("class", "nodeSelected");
}

function esVecino(d)
{
	return sonVecinos(d, __vecino);
}
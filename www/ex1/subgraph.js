function _connectedComponents()
{
	var visited = [], neigh = [], component = [], nc = -1;
	
	for (var k = 0; k < nodes.length; k++) 
	{
		visited[k] = false;
		neigh[k] = [];
	}
		
	for (k = 0; k < links.length; k++)
	{
		// ¿No vale solo con mirar los enlaces solidos?
		if (true || links[k].value == 1)
		{
			neigh[links[k].source.index].push(links[k].target.index); 
			neigh[links[k].target.index].push(links[k].source.index); 
		}
	}
		
	for (var u = 0; u < nodes.length; u++)
	{
		// ¿No vale solo con recorrer los nodos azules ?
		if (/*nodes[u].group == 1 &&*/ !visited[u])
		{
			visited[u] = true;
			nc = nc + 1;
			component[nc] = [u];
			dfs(u);
		}
	}
	
	return component;
	
	function dfs(u)
	{
		for (var k = 0; k < neigh[u].length; k++)
		{
			var v = neigh[u][k];
			if (!visited[v])
			{
				visited[v] = true;
				// Metemos solo los contigs porque estamos explorando todos...
				if (nodes[v].group == 1) 
				   component[nc].push(v);
				dfs(v);
			}
		}
	}
}
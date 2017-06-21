function loadData()
{
	Ext.Ajax.request
	(
		{
    		url: directorio + 'config.ini',
		    success: function(response)
		    {
		    	var config = JSON.parse(response.responseText);
		    	if (config.notes != '')
		    	{
		    		document.getElementById("idNotes").value = config.notes;
		    		initLog(config.log);
		    		addLog('Network loaded');
		    	}
		    	// Ext.getCmp('southRegion').setActiveTab(0);
		    },
		    failure: function(response, request) 
			{
				initLog('Network loaded');
			}
		}
	);
	
	Ext.Ajax.request
	(
		{
			url: directorio + unique + '.req',
			success: function(response)
			{
				AppName += '[' + response.responseText.split('\t')[2] + ']&nbsp;&nbsp;';
				_extLayoutBorder.setTitle(AppName);
			}
		}
	);

	d3.text
	(
		directorio + 'reference.csv',
		function(error, text)
		{
			if (!error)
			{
				var tabla = d3.tsv.parseRows(text);
				for (var k = 0; k < tabla.length; k++)
				{
					referenceHeader[tabla[k][0]] = tabla[k][1];
				}
			}
			cosasDespues();
		}
	)
	
	d3.text
	(
		// Avoid cache
		directorio + redfile + '?_dc=' + Math.floor(Math.random() * 1000),
		function(text)
		{
			grafo = d3.tsv.parseRows(text);

			// Leemos todos los nodos
			var n = 0;
			// Vecinos de cada nodo (cada elemento es un array con sus vecinos) (para evitar enlaces duplicados)
			var neigh = []; 
			for (var k=0; k < grafo.length; k++)
			{
				// Se podia hacer asi, pero los ofuscadores no lo entienden
				// for (var col of [0,2])
				var columna = [0, 2];
				for (var cc = 0; cc < 2; cc++)
				{
					col = columna[cc];
					var nombre = grafo[k][col];
				    if (!hNode.hasOwnProperty(nombre))
				    { 
				    	nodes[n] = new Node(nombre); 
				    	hNode[nombre] = n;
				    	neigh[n] = [];
				    	n = n + 1;
				    }
				}
			}
			
			// Leemos todos los enlaces
	    	n = 0;
			for (var k=0; k < grafo.length; k++)
			{
				var source = grafo[k][0]; 
				var target = grafo[k][2];
				var nSource = hNode[source]; // Indices de source y target
				var nTarget = hNode[target];
				var tipo   = (grafo[k][1] == "hit") ? 2 : 1; 
				
				// Evitamos los enlaces duplicados entre dos contigs
				if (tipo == 2 || neigh[nSource].indexOf(nTarget) == -1)
				{	
					links[n] = new Edge(nodes[nSource], nodes[nTarget], tipo);
					neigh[nSource].push(nTarget);
					neigh[nTarget].push(nSource);
					n = n+1;
				}
			}
			
			rango = new Rango(nodes);
	
			cosasDespues(); 
		}  
	);	
	
	_loadAttribute(directorio + 'rel.csv', relax);
	_loadAttribute(directorio + 'inc.csv', inc);
	_loadAttribute(directorio + 'rip.csv', rip);
}

function _loadAttribute(url, where)
{
	d3.text
	(
		url,
		function(text)
		{
			var data = d3.tsv.parseRows(text);
		
			for (var k=0; k < data.length; k++)
			{
				where.push({node: data[k][0], hit: data[k][1], percentage: data[k][2]});
			}
			cosasDespues(); 
		}
	);	
}

// Constructor de un Node
// Se le puede pasar un nombre u otro Node    
function Node(arg)
{
	if (typeof(arg) == "string")
	{
		var nombre = arg;
		
		this.group = (nombre[0] == "N") ? 1 : 2; // Contig o referencia
		this.name = nombre;
		this.weight = 10;
		this.x = Math.random()*width/2;
		this.y = Math.random()*height/2;
		this.fixed = false;
		if (this.group == 1)
		{
			var token = nombre.split("_");
			this.numero = Number(token[1]);
			this.longitud = 80 + Number(token[3]);;
			this.coverage = Math.round(Number(token[5]));
		}
		else
		{
			this.numero = 0;
			this.longitud = 0;
			this.coverage = 0;
		}
		this.info = "";
	}
	else
	{
		var o = arg;
		
		this.group = o.group;
		this.name = o.name;
		this.weight = o.weight;
		this.x = o.x; 
		this.y = o.y;
		this.fixed = o.fixed;
		this.numero = o.numero;
		this.longitud = o.longitud;
		this.coverage = o.coverage;
		this.info = o.info;
		
		this.px = o.px; this.py = o.py;
		
		if (o.hasOwnProperty('rel')) { this.rel = o.rel; this.relp = o.relp; }
        if (o.hasOwnProperty('inc')) { this.inc = o.inc; this.incp = o.incp; }
        if (o.hasOwnProperty('rip')) { this.rip = o.rip; this.ripp = o.ripp; }
	}
} 

// Constructor de un Link
function Edge(source, target, value)
{
	this.source = source;
	this.target = target;
	this.value = value;
}
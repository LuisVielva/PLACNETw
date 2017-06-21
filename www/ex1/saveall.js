function saveAll(unique)
{
	var red = [];
	
	var hit   = links.filter(function(el) {return el.value == 2;});
	for (var k = 0; k < hit.length; k++)
	{
		red.push(hit[k].source.name + '\thit\t' + hit[k].target.name);
	}
	
	var scaff = links.filter(function(el) {return el.value == 1;});
	for (var k = 0; k < scaff.length; k++)
	{
		red.push(scaff[k].source.name + '\tscaff\t' + scaff[k].target.name);
	}	
	
	var config =
	{
		notes: getNotes(),
		log: getLog()
	}
	
	Ext.Ajax.request
	(
		{
			url: 'capaDatos/wsjson.php',
			params:
			{
				method: 'saveAll',
				red: red.join('\n'),
				config: JSON.stringify(config),
				unique: unique
			},
			success: function(response, request) 
			{
				Message("Your work has been successfully saved");
			},
			failure: function(response, request) 
			{
			    Message("Unable to save your work: " + response.responseText);
			}
		}
	);	
}
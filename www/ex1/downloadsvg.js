function getSvgAsStringOld()
{
	var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
	
	var prefix = 
	{
		xmlns: "http://www.w3.org/2000/xmlns/",
		xlink: "http://www.w3.org/1999/xlink",
		svg: "http://www.w3.org/2000/svg"
	}	

	var svg = document.getElementById("svg");
    svg.setAttribute("version", "1.1");
    
    var defsEl = document.createElement("defs");
    svg.insertBefore(defsEl, svg.firstChild); 

    var styleEl = document.createElement("style")
    defsEl.appendChild(styleEl);
    styleEl.setAttribute("type", "text/css");

    svg.removeAttribute("xmlns");
    svg.removeAttribute("xlink");

	if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) 
	{
		svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
	}
	
	if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) 
	{
		svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
	}
	
	var source = doctype + (new XMLSerializer()).serializeToString(svg).replace
	(
		'</style>', 
		'<![CDATA[' + getStyles(document) + ']]></style>'
	);
	
	return source;
}		

function getSvgAsString()
{
	var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
	
	var prefix = 
	{
		xmlns: "http://www.w3.org/2000/xmlns/",
		xlink: "http://www.w3.org/1999/xlink",
		svg: "http://www.w3.org/2000/svg"
	}	

	var svg = document.getElementById("svg").cloneNode(true);
    svg.setAttribute("version", "1.1");

    svg.removeAttribute("xmlns");
    svg.removeAttribute("xlink");

	if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) 
	{
		svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
	}
	
	if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) 
	{
		svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
	}
	
        try
        {
	    svg.removeChild(svg.getElementById('fondo'));
	    svg.removeChild(svg.getElementById('rectSelection'));
        }
        catch (err)
        {
            var todo = svg.getElementsByTagName("rect")
            svg.removeChild(todo[0]);
            svg.removeChild(todo[0]);
        }
     
	
	var circle = svg.getElementsByTagName('circle');
	for (var k = 0; k < circle.length; k++)
	{
		circle[k].removeAttribute("class");
		circle[k].removeAttribute("id");
		circle[k].removeAttribute("longitud");
		circle[k].setAttribute("stroke", "white");
		circle[k].setAttribute("opacity", "0.75");
		circle[k].setAttribute("stroke-width", "1.5px");
	}
	
	var line = svg.getElementsByTagName('line');
	for (var k = 0; k < line.length; k++)
	{
		line[k].removeAttribute("class");
		line[k].removeAttribute("id");
		line[k].setAttribute("stroke", "#999");
		line[k].setAttribute("opacity", "0.5");
		line[k].setAttribute("stroke-width", "3px");
	}	
		
	var source = doctype + (new XMLSerializer()).serializeToString(svg);
	
	return source;
}		

function getStyles(doc) 
{
	var styles = "";
	var styleSheets = doc.styleSheets;

	if (styleSheets) 
	{
		for (var i = 0; i < styleSheets.length; i++) 
		{
			processStyleSheet(styleSheets[i]);
		}
	}

	function processStyleSheet(ss) 
	{
		if (ss.cssRules) 
		{
			for (var i = 0; i < ss.cssRules.length; i++) 
			{
				var rule = ss.cssRules[i];
				if (rule.type === 3) 
				{
					// Import Rule
					processStyleSheet(rule.styleSheet);
				} 
				else 
				{
					// hack for illustrator crashing on descendent selectors
					if (rule.selectorText) 
					{
						if (rule.selectorText.indexOf(">") === -1) 
						{
							styles += "\n" + rule.cssText;
						}
					}
				}
			}
		}
	}
	
	return styles;
}	

function downloadSvg()
{
	var source = getSvgAsString();
	
	var url = window.URL.createObjectURL
	(
		new Blob
		(
			[source], 
			{"type" : "text\/xml"}
		)
	);
	      
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.setAttribute("download", "placnet.svg");
	a.setAttribute("href", url);
	a.style["display"]="none";
	a.click(); 
}

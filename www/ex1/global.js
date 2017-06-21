var AppName = 'PLACNETw' + Array(3).join('&nbsp;');
var width = 1024, height = 1024;
var svg, link, node;
var _extLayoutBorder;  // Border layout de ExtJS
var _extTree;		   // Arbol de navegacion de ExtJS
var grafo = []; // Datos leidos del red.red.csv
var nodes = []; // nodos que constituyen el grafo, se modifican sus propiedades con el algoritmo de force
var links = []; // idem para los enlaces
var relax = []; // Atributo de relaxasas
var inc = [];   // Atributo de regiones de incompatibilidad
var rip = [];   // Atributo de regiones de replicacion
var rango; // Para calcular los radios de los nodos segun los valores minimo y maximo
var _svgScale; // El grupo svg que sirve para hacer zoom, pan y rotate
var _HighlightFrom = 200; // Rango de longitudes de los nodos a resaltar 
var _HighlightTo = 5000;
var hNode = {}; // Hash table de los nodos existentes, indexados (key) por su nombre y cuyo valor es el índice del nodo
var force;
var referenceHeader = {}; // Hashtable con info adicional de referencias (referenceHeader['NC_022648']='E. Coli..')
var prefix = '../uploads/'; // Directorio en el que se encuentran los datos concretos
var directorio;
var unique;
var redfile;
var tituloIrene;
							
function _getContigInReferenceInfo(contig, reference, unique)
{
	_extTree.disable();
	Ext.Ajax.request
	(
		{
			url: '../uploads/' + unique + '/' + contig + '-' + reference + '.html',
			success: function(response, request) 
			{
				showInfo(response.responseText);	
			},
			failure: function(response, request) 
			{
				showInfo('<h1>Not found!</h1>');
			}
		}
	);	
	
	function showInfo(text)
	{
		_extTree.enable();
		Ext.getCmp('southRegion').setActiveTab(0);
		Ext.getElementById("idAdditionalInfo").innerHTML = text;
	}
}

function _getZipFile(cc, svgAsString, unique)
{
	_extLayoutBorder.disable();
	
	Ext.Ajax.request
	(
		{
			url: 'capaDatos/wsjson.php',
			params:
			{
				method: 'getZipFile',
				cc: JSON.stringify(cc),
				svg: svgAsString,
				notes: getNotes(),
				log: getLog(),
				unique: unique
			},
			success: function(response, request) 
			{
				try 
				{
				    Ext.destroy(Ext.get('downloadIframe'));
				}
				catch(e) {}

				Ext.DomHelper.append
				(
					document.body, 
					{
					   tag: 'iframe',
					   id: 'downloadIframe',
					   frameBorder: 0,
					   width: 0,
					   height: 0,
					   css: 'display:none;visibility:hidden;height:0px;',
					   src: 'capaDatos/download.php?unique=' + unique
					}
				);
				
				_extLayoutBorder.enable();
			},
			failure: function(response, request) 
			{
				_extLayoutBorder.enable();
				Message('Unable to download');
			}
		}
	);	
}

function Message(msg)
{
	Ext.toast
	(
		{
			html: msg,
			closable: true,
			align: 't',
			slideInDuration: 400,
			minWidth: 400
		}
	);
}		

function ApplyTransform()
{	
	_svgScale.setAttribute
	(
		"transform", 
		"translate(" + _panx + ", " + _pany + ") rotate(" + _currentAngle + ") scale(" + _currentScale + ")"
	);
}

function _cargaSvg()
{
	Ext.Ajax.request
	(
		{
			url : "placnet.svg",
			success : function(response, request) 
			{
				Ext.getElementById("idMain").innerHTML = response.responseText;
				paginaCargada();
			}
		}
	);	
}	

function paginaCargada()
{
	svg = d3.select("g#gSvg");
	
	unique = getQueryVariable('unique');
	if (unique == false)
    {
        unique = 'rj45';
        directorio = 'http://gtas4.dicom.unican.es/uploads/rj45/';
    }
    else
    {
        directorio = prefix + unique + '/';
    }
	
	redfile = getQueryVariable('redfile');
	if (redfile == false) redfile = 'red.csv';
	
	loadData();
	
	_svgScale = Ext.getElementById("svgScale");
	draginit();
	zoominit();
	
	tituloIrene = document.getElementById(_extLayoutBorder.getId()).firstChild.firstChild.firstChild.firstChild.firstChild;
}

Ext.define('placnet.layout.Border', 
{
    extend: 'Ext.panel.Panel',
    xtype: 'layout-border',
    requires: 
    [
        'Ext.layout.container.Border'
    ],
    layout: 'border',    
    bodyBorder: false,
    
    defaults: 
    {
        collapsible: true,
        split: true,
        bodyPadding: 10  // Era 10. Eso afectaba a la deteccion de colision
    },
    
    items: 
    [
        {
            region: 'south',
            id: 'southRegion',
            // collapsed: true,            
            height: 200,
            autoScroll: true,
            header: false,
            xtype: 'tabpanel',
			activeTab: 1, 
			items:
			[
				{
				    title: 'Additional info',
				    autoScroll: true,
				    html: "<div id='idAdditionalInfo' style='font-size: 18px' />"
				},			
				{
				    title: 'Notes',
				    autoScroll: true,
				    html: "<textarea id='idNotes' >You can take your own notes here...</textarea>"
				},
				{
				    title: 'Log',
				    autoScroll: true,
				    html: "<textarea id='idLog' class='log' readonly='true' ></textarea>"
				}		
			]
		},       
        {
            title: 'Node tree',
            region: 'west',
            floatable: false, 
            margin: '5 0 0 0',
            width: 250, // "33%"
            autoScroll: true,
            // autoWidth: true,
            // collapsed: true,
            html: "<div id='idTree' />",
            listeners:
            {
            	resize: function() { if (typeof _extTree != "undefined") _extTree.getView().refresh(); }
            },
            header:
            {
	            listeners: 
			    {

      				dblclick: function(s,r) 
      				{
      					_extTree.collapseAll();
      				} 				
  				}
            }
        },
        {
            title: "Node graph",
            id: 'idCenterRegion',
            collapsible: false,
            region: 'center',
            margin: '5 0 0 0',
            autoScroll: false, // true,
            bodyPadding: 0,
            header: false,
			tbar: new Ext.Toolbar
		    (
		    	{ 
				    items: 
				    [
				        {
				        	id: 'btnPause',
				            icon: 'png/pause.png',
				            tooltip: 'Pause clustering algorithm',
							tooltipType: 'title',
				            handler: function() { _btnPause(); }
				        },
				        {
				        	id: 'btnPlay',
				            icon: 'png/play.png',
				            tooltip: 'Resume clustering algorithm',
				            tooltipType: 'title',
				            handler: function() { _btnPlay(); }
				        },
				        {
				            icon: 'png/link.png',
				            tooltip: 'Select contigs by node length',
				            tooltipType: 'title',
				            handler: function() { _btnSelectContigs(); }
				        },    
				        {
				        	id: 'btnSearch',
				            icon: 'png/book.png',
				            tooltip: 'Select references by name',
				            tooltipType: 'title',
				            handler: function() { _btnSelectReferences(); }
				        }, 	
				        {
				        	id: 'btnInfo',
				            icon: 'png/info.png',
				            tooltip: 'Relevant information about selected nodes',
				            tooltipType: 'title',
				            handler: function() { _btnInfo(); }
				        }, 					        				          
				        {
				            icon: 'png/zoomin.png',
				            tooltip: 'Zoom In',
				            tooltipType: 'title',
				            handler: function() { _btnZoomIn(); }
				        }, 
				        {
				            icon: 'png/zoomout.png',
				            tooltip: 'Zoom Out',
				            tooltipType: 'title',
				            handler: function() { _btnZoomOut(); }
				        }, 	
				        {
				            icon: 'png/rotateleft.png',
				            tooltip: 'Rotate left',
				            tooltipType: 'title',
				            handler: function() { _btnRotate(-5); }
				        }, 		
				        {
				            icon: 'png/rotateright.png',
				            tooltip: 'Rotate right',
				            tooltipType: 'title',
				            handler: function() { _btnRotate(5); }
				        }, 						        		        			        
				        '->', 
				        {
				        	id: 'btnClone',
				        	icon: 'png/duplicate.png',
				        	tooltip: 'Duplicate node',
				        	tooltipType: 'title',
				        	handler: function() { _btnClone(); }
				        },        
				        {
				        	id: 'btnAddLink',
				        	icon: 'png/addlink.png',
				        	tooltip: 'Links two unlinked nodes',
				        	tooltipType: 'title',
				        	handler: function() { _btnAddLink(); }
				        }, 
				        {
				        	id: 'btnDelete',
				        	icon: 'png/delete.png',
				        	tooltip: 'Delete selected item',
				        	tooltipType: 'title',
				        	handler: function() { _btnDelete(); }
				        },
				        {
				        	id: 'btnUndo',
				        	icon: 'png/undo.png',
				        	tooltip: 'Undo last delete or duplicate',
				        	tooltipType: 'title',
				        	handler: function() { _btnUndo(); }
				        },
				        {
				        	id: 'btnSave',
				            icon: 'png/save.png',
				            tooltip: 'Save current state of the network for future use',
				            tooltipType: 'title',
				            handler: function() { _btnSaveAll(); }
				        },
				        {
				        	id: 'btnHome',
				            icon: 'png/home-alt.png',
				            tooltip: 'Reloads the initial state of the network',
				            tooltipType: 'title',
				            handler: function() { _btnHome(); }
				        },
				        {
				        	id: 'btnDownload',
				            icon: 'png/download-alt.png',
				            tooltip: 'Download results as a .zip file',
				            tooltipType: 'title',
				            handler: function() { _btnDownload(); }
				        }				        				         					              
				    ]
		      	}
		    ),            

            html: "<div id='idMain' />"
        }
    ]
});

Ext.EventManager.onWindowResize
(
	function () 
	{
	    _extLayoutBorder.setSize(window.innerWidth, window.innerHeight);	    
	}
);

Ext.application
(
	{
	    name: 'placnet',
	    launch: function() 
	    {	    	
			_extLayoutBorder = Ext.create
			(
				'placnet.layout.Border',  
				{
		            renderTo     : Ext.getBody(),
		            width        : "100%", 
		            height       : window.innerHeight,
		            bodyPadding  : 5,
		            title        : AppName
		        }
			);
			
			_extTree = Ext.create
			(
				'Ext.tree.Panel', 
				{
				    renderTo: Ext.getElementById("idTree"),
				    width: "100%",
				    useArrows: true,
				    rootVisible: false,
				    autoScroll: true,
				    root: 
				    {
				        text: 'Root',
				        expanded: true
				    },
				    listeners: 
				    {
        				itemclick: function(s,r) 
        				{
        					_selectNodeFromTree(r.data.node);
        				},
        				itemmouseenter: function(aaa, record, item, index, e, eOpts)
        				{
        					// Se podria hacer asi http://jaketrent.com/post/d3-class-operations/
        					// pero el d3.select no funciona con ids que tengan numeros reales
        					var el = document.getElementById("node." + record.data.node.name);
        					el.setAttribute("class", el.getAttribute("class") + ",hover");
        					_showNodeInfo({info: item.innerText});
        				},
        				itemmouseleave: function(aaa, record, item, index, e, eOpts)
        				{
        					var el = document.getElementById("node." + record.data.node.name);
        					el.setAttribute("class", el.getAttribute("class").split(",hover")[0]);
        					_showNodeInfo(null);
        				}
    				}
				}
			);	
			
			_cargaSvg();
	    }
	}
);

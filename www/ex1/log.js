function addLog(text)
{
	setLog((new Date()).toLocaleString() + ':\t' + text + '\n' + getLog());
}

function setLog(text)
{
	Ext.getElementById("idLog").innerHTML = text;	
}

function getLog()
{
	return Ext.getElementById("idLog").innerHTML;
}

// Da error si leemos o ponemos el innerHTML antes de crearse la primera vez...
// por eso nos aseguramos de que exista
function initLog(text)
{
	var oldTab = Ext.getCmp('southRegion').getActiveTab();
	Ext.getCmp('southRegion').setActiveTab(2);
	setLog(text);
	Ext.getCmp('southRegion').setActiveTab(oldTab);	
}

function getNotes()
{
	return document.getElementById("idNotes").value;
}
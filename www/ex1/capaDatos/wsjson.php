<?php

switch ($_REQUEST['method'])
{
	case 'getContigInReferenceInfo':
		require_once('getContigInReferenceInfo.php');	
		$contig=$_REQUEST['contig'];
		$reference=$_REQUEST['reference'];
		$unique = $_REQUEST['unique'];
		echo getContigInReferenceInfo($contig, $reference, $unique);
		break;
		
	case 'getZipFile':
		require_once('getZipFile.php');
		$cc = json_decode(stripslashes($_REQUEST['cc'])); 
		$svg = $_REQUEST['svg'];
		$notes = $_REQUEST['notes'];
		$log = $_REQUEST['log'];
		$unique = $_REQUEST['unique'];
		echo getZipFile($cc, $svg, $notes, $log, $unique);
		break;
		
	case 'saveAll':
		require_once('saveAll.php');
		// $red = json_decode(stripslashes($_REQUEST['red']));
		// $red = json_decode($_REQUEST['red']); 
		$red = $_REQUEST['red']; 
		$config = $_REQUEST['config'];
		$unique = $_REQUEST['unique'];
		echo saveAll($red, $config, $unique);
		break;		
}

?>
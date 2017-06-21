<?php
	$unique = $_GET['unique'];
	$filename = "/var/www/html/uploads/" . $unique . "/" . $unique . ".zip";
	
	if (file_exists($filename)) 
	{
	    header('Content-Description: File Transfer');
	    header('Content-Type: application/octet-stream');
	    header('Content-Transfer-Encoding: Binary');
	    header('Content-Disposition: attachment; filename="' . basename($filename) . '"');
	    header('Expires: 0');
	    header('Cache-Control: must-revalidate');
	    header('Pragma: public');
	    header('Content-Length: ' . filesize($filename));
	    readfile($filename);
	    exit;
	}
?>

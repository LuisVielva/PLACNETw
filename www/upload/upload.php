<?php

// Where to place the file (better out of webserver directory)
$root= '/media/luis/ADATA/cloud/';

// Check all the files are received
$nFiles = count($_FILES);
if ($nFiles != 2)
{
	echo json_encode(array('success' => false, 'msg' => 'Invalid number of files'));
	return;
}

// Check that all the files are well transfered
// If any fails, none is accepted
if 
(
	$_FILES['readFile1']['error'] != UPLOAD_ERR_OK or
	$_FILES['readFile2']['error'] != UPLOAD_ERR_OK 
)
{
	echo json_encode(array('success' => false, 'msg' => 'Error uploading file(s)'));
	return;
}

// Check the files are of the right type
$tipo1 = exec("file -i -b " . $_FILES['readFile1']['tmp_name']);
$tipo2 = exec("file -i -b " . $_FILES['readFile2']['tmp_name']);
$tipo1 = explode(" ", $tipo1)[0];
$tipo2 = explode(" ", $tipo2)[0];
if ($tipo1 != "application/gzip;" || $tipo2 != "application/gzip;")
{
     echo json_encode(array('success' => false, 'msg' => 'Bad file type: only gzip-compressedi fastq files are acepted'));
     return;
}

// move the file to a unique directory
$unique = uniqid();
$destino = $root . $unique;
$exito = mkdir($destino, 0777);
move_uploaded_file($_FILES['readFile1']['tmp_name'], $destino . '/R_1.fastq.gz');
move_uploaded_file($_FILES['readFile2']['tmp_name'], $destino . '/R_2.fastq.gz');

// Copy the address of the response email to the directory
$filename = $destino . "/" . $unique . ".req";
file_put_contents($filename, $unique . "\t" . $_POST['email'] . "\t" . $_POST['name'] . "\n");

// Change the permissions
chmod($destino, 0777);
chmod($destino . '/R_1.fastq.gz', 0777);
chmod($destino . '/R_2.fastq.gz', 0777);
chmod($filename, 0777);

$response = array
(
    'success' => true,
    'data' => array
    (
    	'email' => $_POST['email']
    ),
    'msg' => 'Files Uploaded successfully'
);
echo json_encode($response);

?>

<?php

function getZipFile($cc, $svg, $notes, $log, $unique)
{
	// Directorio de trabajo
	$directorio = "/var/www/html/uploads/" . $unique;
	
	// Creamos el fichero placnet.svg
	$svgfile = fopen($directorio . "/placnet.svg", "w");
	fwrite($svgfile, $svg);
	fclose($svgfile);
	
	// Creamos el fichero notes.txt
	$notesfile = fopen($directorio . "/notes.txt", "w");
	fwrite($notesfile, $notes);
	fclose($notesfile);	
	
	// Creamos el fichero log.txt
	$logfile = fopen($directorio . "/log.txt", "w");
	fwrite($logfile, $log);
	fclose($logfile);	
		
	// Nombre de la macro
	$filename = $directorio . "/go";
	
	// Creamos el fichero con la macro
	$macro = fopen($filename, "w");
	
	// Vamos al directorio
	chdir($directorio);	

	// Borramos posibles ficheros comp*.fa
	fwrite($macro, "rm -f comp*.fa\n");
	
	// Hacemos que cree los ficheros comp*.fa
	for ($k = 0; $k < count($cc); $k++)
	{
		fwrite($macro, "for i in " . $cc[$k] . "\n");
		fwrite($macro, "do\n");
		fwrite($macro, 'cat NODE_$i.fa >> comp' . $k . ".fa\n");
		fwrite($macro, "done\n");
	}
	
	// Creamos el zip
	fwrite($macro, "zip " . $unique . " placnet.prod.* tmp*.blast placnet.svg notes.txt log.txt *Logfile.txt comp*.fa\n");

	// Cerramos el fichero de macro	
	fclose($macro);
	
	// Cambiamos los permisos
	chmod($filename, 0777);
	
	// Invocamos la macro
	shell_exec($filename);
	
	$response = array
	(
		'success' => true,
	    'data' => array
	    (
	    	'email' => '', 
	    	'size' => 0
	    ),
	    'msg' => 'Files Uploaded successfully'
	);
	echo json_encode($response);
}

//print(getConnectedComponentsFile(["1 2 175 11 3 168 74 23 6 4 7 30 46 34 83 77 230 69 19 54 52 183 59 16 76 29 26 75 85 95 55 218 88 47 49 193 36 71 62 72 113 84 78 120 136 25 270 61 138 24 252 33 82 12 9 142 135 5 114 220 17 198 124 22 202 195 50 190 89 167 134 105 106 40 79 238 125 51 18 63 268 250 148 172 185 235 171 100 67 86 99 116 237 243 27 248 31 42 186 91 20 58 97 109 39 64 80 211 169 43 107 44 57 166 212 87 280 104 14 164 32 189 264 173 37 8 143 111 155 117 53 146 188 201 176 181 119 207 206 258 118 90 137 110 261 56 68 162 192 196 165 259 153 60 103 10 35 121 15 13 41 139 48 70","28"], 'rj45'));


?>

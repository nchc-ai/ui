<?php

//curl -d '{"container-name":"abc-test","apache-port":"30000"}' -H "Content-Type: application/json" -X DELETE https://twgc-gateway.nchc.org.tw/delete_config.php --insecure

require('lib/content_check.php');


//Make sure that it is a DELETE request.
if(strcasecmp($_SERVER['REQUEST_METHOD'], 'DELETE') != 0){
	echo json_encode(array('error'=>'Request method must be DELETE!')); 
    throw new Exception('Request method must be DELETE!');
}

if( !empty($decoded['container-name']) and 
	!empty($decoded['apache-port'])
	 ){

	//$output = shell_exec("sudo sh rfw.sh ".$decoded['account'] ." ".$decoded['password']." ".$decoded['dgx1-port']);
	//var_dump($decoded);	
	$output = shell_exec("sudo /bin/bash scripts/delete_gateway.sh " .
				$decoded['apache-port'] . " " .
				$decoded['container-name']);
        file_put_contents("debug/debugcmd.txt","sudo /bin/bash scripts/delete_gateway.sh " .
                                $decoded['apache-port'] . " " .
                                $decoded['container-name']);
	echo json_encode(array('output'=>$output));
}else{
	echo json_encode(array('error'=>'At least one parameter is null. Please check your parameters.')); 
	throw new Exception('At least one parameter is null. Please check your parameters.');
}

?>

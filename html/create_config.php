<?php

require('lib/content_check.php');

//Make sure that it is a PUT request.
if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') != 0){
	echo json_encode(array('error'=>'Request method must be POST!')); 
    throw new Exception('Request method must be POST!');
}




if(	!empty($decoded['dgx1-port']) and
	!empty($decoded['dgx1-domain-name']) and
	!empty($decoded['apache-port']) and
	!empty($decoded['container-name']) and
	!empty($decoded['service-type'])  ){

	// AUTH and IP
	if(	!empty($decoded['account']) and 
		!empty($decoded['password']) and 
		!empty($decoded['user-source-ip']) ){
		$output = shell_exec("sudo /bin/bash scripts/config_gateway.sh " .
					$decoded['apache-port'] . " " .
					$decoded['container-name'] . " " .
					$decoded['dgx1-domain-name'] . " " .
					$decoded['dgx1-port'] . " " .
					$decoded['service-type'] . " " .
					$decoded['account'] . " " .
					$decoded['password'] . " " .
					$decoded['user-source-ip']);
	}
	// AUTH
	if(	!empty($decoded['account']) and 
		!empty($decoded['password']) and 
		empty($decoded['user-source-ip']) ){
		$output = shell_exec("sudo /bin/bash scripts/config_auth_gateway.sh " .
					$decoded['apache-port'] . " " .
					$decoded['container-name'] . " " .
					$decoded['dgx1-domain-name'] . " " .
					$decoded['dgx1-port'] . " " .
					$decoded['service-type'] . " " .
					$decoded['account'] . " " .
					$decoded['password']);

	}
	// IP
	if(	empty($decoded['account']) and 
		empty($decoded['password']) and 
		!empty($decoded['user-source-ip']) ){

		//Check user-source-ip
		$ip_cidr =  explode(',',$decoded['user-source-ip']) ;
		foreach ($ip_cidr as $value) {
			if( !valid_ip_cidr($value) ){
				echo json_encode(array('error'=>'Invalid parameter : user source ip:'.$decoded['user-source-ip']));
				throw new Exception("Invalid parameter : user source ip:".$decoded['user-source-ip']);
			}
		}
		$output = shell_exec("sudo /bin/bash scripts/config_ip_gateway.sh " .
					$decoded['apache-port'] . " " .
					$decoded['container-name'] . " " .
					$decoded['dgx1-domain-name'] . " " .
					$decoded['dgx1-port'] . " " .
					$decoded['service-type'] . " " .
					$decoded['user-source-ip']);
	}

	echo json_encode(array('output'=>$output));

}else{
	echo json_encode(array('error'=>'At least one parameter is null. Please check your parameters.')); 
	throw new Exception('At least one parameter is null. Please check your parameters.');
}

?>

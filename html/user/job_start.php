<?php
include "../session.php";

if ( isset($_GET['job_id'])){

    $sql="select * from `job` where `aid`='".$_SESSION['aid']."' AND `job_id`='".addslashes($_GET['job_id'])."';";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    $rownum = mysqli_num_rows($result);

	$curl = curl_init();
	
	curl_setopt_array($curl, array(
	  CURLOPT_PORT => "2375",
	  CURLOPT_URL => "http://".$row['docker_server'].":2375/containers/".$row['job_id']."/start",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 30,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "POST",
	  CURLOPT_HTTPHEADER => array(
	    "cache-control: no-cache",
	    "content-type: application/json",
	    "postman-token: 58b7898a-95c9-bc09-21bb-950ec1667b4c"
	  ),
	));
	
	$response = curl_exec($curl);	
	curl_close($curl);

	$sqlupdate = "UPDATE `job` SET `status`='start' WHERE `job_id`='".$_GET['job_id']."'";
	mysqli_query($conn,$sqlupdate);

}

// Back
if ( isset($_GET['redir'])){
    header("Location:".addslashes($_GET['redir']).".php");
}else{
    header("Location:job.php");
}

die();
?>


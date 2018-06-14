<?php
include "../session.php";

if ( isset($_GET['job_id']) and !isset($_GET['course_id'])){
    // Delete Container
    $sql="select * from `job` where `aid`='".$_SESSION['aid']."' AND `job_id`='".addslashes($_GET['job_id'])."';";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    $rownum = mysqli_num_rows($result);
    
    if ( $rownum == 1 ){
        $url='http://' . $row['docker_server'] . ':2375/containers/' . $row['job_id'] . '?v=true';
        $ch=curl_init($url);
        curl_setopt($ch,CURLOPT_CUSTOMREQUEST,"DELETE");
        $result=curl_exec($ch);
        
        // Delete Gateway Configuration Step 1
        $jsonData=array(
        	'apache-port'=>$row['gateway_port'],
        	'container-name'=>$row['job_id']
        );
        $data=json_encode($jsonData);
        $url='http://'.$_SESSION['gatewayip'].'/delete_config.php';
        $ch=curl_init($url);
        curl_setopt($ch,CURLOPT_CUSTOMREQUEST,"DELETE");
        curl_setopt($ch,CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch,CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        $result=curl_exec($ch);
        $sqldel = "DELETE FROM `job` WHERE `job_id`='".$row['job_id']."';";
        mysqli_query($conn,$sqldel);
    }

	// Back
	if ( isset($_GET['redir'])){
	    header("Location:".addslashes($_GET['redir']).".php");
	}else{
	    header("Location:job.php");
	
	}
	die();

}
elseif (!isset($_GET['job_id']) and isset($_GET['course_id'])){

//    $sql="select * from `course` where `user_id`='".$_SESSION['aid']."' AND `id`='".addslashes($_GET['course_id'])."';";
//    $result = mysqli_query($conn, $sql);
//    $row = mysqli_fetch_assoc($result);

    $sql="select * from `job` where `course_id`='".addslashes($_GET['course_id'])."';";
    $result = mysqli_query($conn, $sql);
    $jobrownum = mysqli_num_rows($result);
    for ($i=0;$i<$jobrownum;$i++){
	$jobrow = mysqli_fetch_assoc($result);

	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_PORT => "2375",
	  CURLOPT_URL => "http://".$jobrow['docker_server'].":2375/containers/".$jobrow['job_id']."/kill",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 30,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "POST",
	  CURLOPT_HTTPHEADER => array(
	    "cache-control: no-cache",
	    "postman-token: 94dc4cd2-4050-46b9-7598-55566137b682"
	  ),
	));
	$docker_kill = curl_exec($curl);

	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_PORT => "2375",
	  CURLOPT_URL => "http://".$jobrow['docker_server'].":2375/containers/".$jobrow['job_id'],
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 30,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "DELETE",
	  CURLOPT_HTTPHEADER => array(
	    "cache-control: no-cache",
	    "content-type: application/json",
	    "postman-token: 72c8b668-9b55-9cf0-2cee-7e13dcea2ca1"
	  ),
	));
	$docker_rm = curl_exec($curl);

	$sqldel = "DELETE FROM `job` WHERE `job_id`='".$jobrow['job_id']."';";
	mysqli_query($conn,$sqldel);
    }

    $sqldel = "DELETE FROM `course` WHERE `id`='".$_GET['course_id']."';";
    mysqli_query($conn,$sqldel);



	// Back
	if ( isset($_GET['redir'])){
	    header("Location:".addslashes($_GET['redir']).".php");
	}else{
	    header("Location:course.php");
	
	}
	die();

}
?>

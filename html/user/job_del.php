<?php
include "../session.php";

if ( isset($_GET['job_id'])){
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
}
// Back
if ( isset($_GET['redir'])){
    header("Location:".addslashes($_GET['redir']).".php");
}else{
    header("Location:job.php");

}
die();
?>

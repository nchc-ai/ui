<?php
include "../session.php";
// Delete Container
$sql="select * from `job` where `aid`='".$_SESSION['aid']."' AND `job_id`='".addslashes($_GET['job_id'])."';";
$result = mysqli_query($conn, $sql);
$rownum = mysqli_num_rows($result);
if ( $rownum == 1 ){
    $row = mysqli_fetch_assoc($result);
    
    $url='http://' . $row['docker_server'] . ':2375/containers/' . $row['job_id'] . '/stop';
    $ch=curl_init($url);
    
    curl_setopt($ch,CURLOPT_CUSTOMREQUEST,"POST");
    $result=curl_exec($ch);
    $sqlupdate="UPDATE `job` SET `status`='stop' WHERE `job_id`='".$row['job_id']."';";
    mysqli_query($conn,$sqlupdate);
    #echo $result;
}
header("Location:job.php");
die();
?>

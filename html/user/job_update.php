<?php
include "../session.php";
include "includejs.php";
// DB Connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ( isset($_POST['gateway_id']) && isset($_POST['gateway_password']) && isset($_POST['job_id'])){

    $sql="select * from `job` where `aid`='".$_SESSION['aid']."' AND `job_id`='".addslashes($_POST['job_id'])."';";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    $rownum = mysqli_num_rows($result);
    
    if ( $rownum == 1 ){
        #$url='http://' . $row['docker_server'] . ':2375/containers/' . $row['job_id'] . '?v=true';
        #$ch=curl_init($url);
        #curl_setopt($ch,CURLOPT_CUSTOMREQUEST,"DELETE");
        #$result=curl_exec($ch);
    
        // Delete Gateway Configuration Step 1
        if ( $row['mode'] == '1' ){
            $service_type='digits';
        }elseif($row['mode'] == '2'){
            $service_type='tensorboard';
        }else{
            $service_type='';
        }
        $jsonData=array(
            'apache-port'=>$row['gateway_port'],
            'container-name'=>$row['job_id'],
            'gateway-id'=>$_POST['gateway_id'],
            'gateway-password'=>$_POST['gateway_password'],
            'service-type'=>$service_type
        );
        $data=json_encode($jsonData);
        $url='http://'.$_SESSION['gatewayip'].'/update_config.php';
        $ch=curl_init($url);
        curl_setopt($ch,CURLOPT_CUSTOMREQUEST,"UPDATE");
        curl_setopt($ch,CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch,CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        $result=curl_exec($ch);
        $sqlupdate = "UPDATE `job` SET `gateway_id`='".$_POST['gateway_id']."', `gateway_password`='".$_POST['gateway_password']."'  WHERE `job_id`='".$row['job_id']."';";
        mysqli_query($conn,$sqlupdate);
    }

    // Back
header("Location:job.php");
exit();
}
else{
    echo "<script>alert('修改失敗，請再次嘗試');location.href = 'job.php';</script>";
    exit();
}

//die();
?>

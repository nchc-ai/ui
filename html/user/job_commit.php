<?php
include "../session.php";
include "docker_restful.php";
// DB Connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ( isset($_GET['job_id']) && isset($_GET['commit_tag'])  ){

    $sqlselect = "select * from `job` where `job_id`='".addslashes($_GET['job_id'])."' AND `aid`='".$_SESSION['aid']."';";
    $resultselect = mysqli_query($conn, $sqlselect);
    $rowselect = mysqli_fetch_assoc($resultselect);
    if ( $rowselect != NULL ){
        unset($output);
        exec("ssh dockeruser@".$rowselect['docker_server']." \"sudo nvidia-docker ps --format '{{.Names}},{{.ID}},{{.Image}}' | grep '^".$rowselect['job_id'].",' \"",$output);
        $JobInfoArr=explode(",",$output[0]);
        
        if ( $JobInfoArr[0] == $_GET['job_id'] ){
            $job_id = $JobInfoArr[0];
            $container_id=$JobInfoArr[1];
            $image_name_arr=explode(":",$rowselect['di_id']);
            $image_name=$image_name_arr[0];
            $commit_tag=str_replace(":","",addslashes($_GET['commit_tag']));
            unset($output);
            exec("ssh dockeruser@".$rowselect['docker_server']." \"sudo nvidia-docker commit --author ".$_SESSION['username']." ".$container_id." ".$image_name.":".$commit_tag." \"",$output);
            $checkcode=explode(":",implode(",",$output));
            if ( $checkcode[0] == "sha256"){
                $sqldockerimage = "select * from `docker_image` where `name`='".$image_name_arr[0]."' AND `tag`='".$image_name_arr[1]."';"; 
                $resultdockerimage = mysqli_query($conn, $sqldockerimage);
                $rowdockerimage=mysqli_fetch_assoc($resultdockerimage);
                #echo $sqldockerimage."\n";
                #var_dump($rowdockerimage);
                $sqlinsert= "insert into `docker_image` ( `name`,`tag`,`software_list`,`mode`,`cmd`) values('".$image_name."','".$commit_tag."','".$rowdockerimage['software_list']."','".$rowdockerimage['mode']."','".$rowdockerimage['cmd']."')";
                mysqli_query($conn,$sqlinsert);
                #echo $sqlinsert."\n";
                echo "ok";
            }else{
                echo "error";
            }
        }
    }

}

?>

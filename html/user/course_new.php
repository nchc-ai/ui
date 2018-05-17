<?php
include "../session.php";
// DB Connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ( isset($_POST['DDL_di_id']) && isset($_POST['course_name']) && isset($_POST['course_intro']) ){
    $docker_name=addslashes($_POST['DDL_di_id']);
    $post_docker_image_id=$post_di_id_array[3];
    $DSetCount = addslashes($_POST['DSetCount']);
    $course_name=addslashes($_POST['course_name']);
    $course_intro=addslashes($_POST['course_intro']);
    $dataset="";
    for ( $i=0;$i<$DSetCount;$i++){
        if( isset($_POST['DSet'.$i])){
             if ( $dataset == "" ){
                 $dataset=addslashes($_POST['DSet'.$i]);
             }else{
                 $dataset=$dataset.",".addslashes($_POST['DSet'.$i]);
             }
        }
    }
    #$_POST[
#    $sqldockerimg = "select * from `docker_image` where `di_id`='".$post_docker_image_id."';";
#    $resultdockerimg = mysqli_query($conn, $sqldockerimg);
#    $rowdockerimg = mysqli_fetch_assoc($resultdockerimg);
#
    $sqlinsert= "insert into `course` ( `course_name`,`course_intro`,`docker_name`,`user_id`,`dataset`,`create_time`,`update_time`) values('".$course_name."','".$course_intro."','".$docker_name."','".$_SESSION['aid']."','".$dataset."','".date("Y-m-d H:i:s")."','".date("Y-m-d H:i:s")."')";
    mysqli_query($conn,$sqlinsert);
    #echo $sqlinsert;
   
}

header("Location:course.php");
exit;
?>

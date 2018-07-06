<?php
include "../session.php";

if (!isset($_GET['job_id']) and isset($_GET['course_id'])){

    $sql="select * from `course` where `user_id`='".$_SESSION['aid']."' AND `id`='".addslashes($_GET['course_id'])."';";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);

    $sql="select * from `job` where `course_id`='".addslashes($_GET['course_id'])."';";
    $result = mysqli_query($conn, $sql);
//    while(true){
//	    if ($jobrow = mysqli_fetch_assoc($result)){
//		print_r($jobrow);
//	        $sqldel = "DELETE FROM `job` WHERE `job_id`='".$jobrow['job_id']."';";
//	        mysqli_query($conn,$sqldel);
//	    }
//	    else{
//	    break;
//	    }
//    }
    $jobrownum = mysqli_num_rows($result);
    for ($i=0;$i<$jobrownum;$i++){
            $jobrow = mysqli_fetch_assoc($result);
	    print_r($jobrow);


                $sqldel = "DELETE FROM `job` WHERE `job_id`='".$jobrow['job_id']."';";
                mysqli_query($conn,$sqldel);
            
    }
//print_r($jobrow);

//        // Back
//        if ( isset($_GET['redir'])){
//            header("Location:".addslashes($_GET['redir']).".php");
//        }else{
//            header("Location:course.php");
//
//        }
//        die();

}


?>


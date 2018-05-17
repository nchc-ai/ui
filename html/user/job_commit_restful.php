<?php
include "../session.php";
include "docker_restful.php";



if($_POST['repo']==""){
$repo=$_SESSION['username'];
}
else{
$repo=$_SESSION['username']."/".$_POST['repo'];
}

$sqlexist="SELECT `di_id` FROM `docker_image` WHERE `name`='".$repo."' AND `tag`='".$_POST['tag']."'";
$resultexist=$conn->query($sqlexist);
$rowexist=$resultexist->fetch_assoc();

if (! isset($rowexist)){
//commit
docker_commit(localhost,$_POST['job_id'],$repo,$_POST['tag']);
//echo $_SESSION['username'].",".$_POST['repo'].",".$_POST['job_id'].",".$repo.",".$_POST['tag'];

$image_all=explode(":",$_POST['di_id']);
$name=$image_all[0];
$tag=$image_all[1];

$sql="SELECT `di_id`, `software_list`, `mode`, `cmd` FROM `docker_image` WHERE `name`='".$name."' AND `tag`='".$tag."'";
$result=$conn->query($sql);
$row=$result->fetch_assoc();

$sqlinsert= "insert into `docker_image`(`name`, `tag`, `software_list`, `mode`, `cmd`) VALUES ('".$repo."','".$_POST['tag']."','".$row['software_list']."','".$row['mode']."','".$row['cmd']."')";
mysqli_query($conn,$sqlinsert);

//Back
echo "<script>alert('Job commit success.'); location.href ='job.php';</script>";
}
else{
$a='job_edit.php?job_id='.$_POST['job_id'].'&di='.$_POST['di_id'];
echo "<script>alert('Image命名與現有的重複!');";
echo "window.location=('$a');";
echo "</script>";
}
?>

<?php
include '../session.php';
/**
 * 表單接收頁面
 */
if($_POST['folder']==""){
echo "<script>alert('請輸入資料夾名稱'); location.href ='course.php';</script>";
}
else{
 
// 網頁編碼宣告（防止產生亂碼）
header('content-type:text/html;charset=utf-8');
// 封裝好的 PHP 多檔案上傳 class
include_once 'upload.class.php';
$foldername='/home/chou/mntest/datasets/'.$_SESSION['username'].'/'.$_POST['folder'];

$upload = new Upload($foldername);
$ret = $upload->callUploadFile();


	if ($ret[0]==0){
		$sqlexist="SELECT * FROM `data_upload` WHERE `name`='".$_POST['folder']."' AND `userid`='".$_SESSION['aid']."'";
		$resultexist=$conn->query($sqlexist);
		$rowexist=$resultexist->fetch_assoc();
		if (!isset($rowexist)){
		//insert to db
			$sqlinsert="INSERT INTO `data_upload`(`name`, `userid`) VALUES ('".$_POST['folder']."','".$_SESSION['aid']."')";
			mysqli_query($conn,$sqlinsert);
		}
               //轉址
               echo "<script>alert('上傳成功');";
               echo "window.location=('course_create.php');";
               echo "</script>";
	}
	else{
	$mess_count=count($ret[1]);
	$message;
	for ($i=0;$i<$mess_count;$i++){$message=$message.$ret[1][$i]."\\n";}
	echo "<script>alert('$message'); location.href ='course.php';</script>";
#	header('Location: course.php');
	}
#echo $upload->(); 
#echo $upload->getDestination();

}



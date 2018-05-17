<?php
session_start();
if($_SESSION['authenticated'] == true){
       $LoginTime = '登入時間： '.$_SESSION['login_time'];
       include "../db.php";
       $conn = mysqli_connect($DBHost ,$DBUser ,$DBPasswd ,$DBName);
}else{
       header('Location: ../index.php');
       exit;
}
?>

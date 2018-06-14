<?php include "../session.php";
?>
<!DOCTYPE html>
<html>  
<head>  
<meta charset="UTF-8">  
<title>正在修改密碼</title>  
</head>  
<body>  
<?php   

	$username = $_REQUEST ["username"];  
	$oldpassword = $_REQUEST ["oldpassword"];  
	$newpassword = $_REQUEST ["newpassword"];  
	$checknewpassword =$_REQUEST ["checknewpassword"];
        $sql="select * from `user` where `id`='".$_SESSION['id']."' ";
        $result = mysqli_query($conn, $sql);  
        $row = mysqli_fetch_array($result);
        $dbusername = $row["id"];
    	$dbpassword = $row ["password"];	
//	echo "dbusername=".$dbusername;
//	echo $dbpassword;
//  	echo $newpassword;
//	echo "check=".$checknewpassword;  	
	if ($username != $_SESSION['id']){
		echo "<script>alert('帳號錯誤!');";
                echo "window.location=('test_password.php');";
                echo "</script>";
	}
        if ($oldpassword != $dbpassword) {  
		echo "<script>alert('密碼錯誤!');";
		echo "window.location=('test_password.php');";
		echo "</script>";
	}
        if ($newpassword != $checknewpassword){
		echo "<script>alert('新密碼確認錯誤!');";
                echo "window.location=('test_password.php');";
                echo "</script>";
	}

//更改密碼  
	else if($oldpassword == $dbpassword && $newpassword == $checknewpassword ){ 
	$update="update `user` set `password`='".$newpassword."' where `id`='".$_SESSION['id']."'";
	$a=mysqli_query($conn, $update);  
	echo "<script>alert('密碼修改成功!');";
        echo "window.location=('test_password.php');";
        echo "</script>";
}
?>  
</body>  
</html>


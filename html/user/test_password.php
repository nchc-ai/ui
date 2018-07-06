<?php include "../session.php";?>

<!DOCTYPE html>
<html>
<head>
<title><?php echo $_SESSION['username'];?>@企業列車</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<?php include "includecss.php";?>
</head>
<body style="font-family:微軟正黑體">
<?php include "menu.php";?>

 <section class="g-bg-gray-dark-v1 g-color-white g-py-20">
                <div class="container">
                        <div class="d-sm-flex text-center">
                                <div class="align-self-center">
                                        <h2 class="h3 g-font-weight-300 w-100 g-mb-10 g-mb-0--md"><b>修改密碼</b></h2>
                                </div>
                        </div>
                </div>
        </section>



    <?php   
       
	$sql="select * from `user` where `id`='".$_SESSION['id']."' ";
        $result = mysqli_query($conn, $sql);
	$row = mysqli_fetch_array($result);
?>  
<section class="container g-pb-10">
                <div class="row">
                        <div class="col-lg-12 g-mb-20">
                                <div class="form-group g-mb-20">
</br>
    <form  action="password_edit.php" method="post" onsubmit="return alter()" style="font-size:17px;">  
        帳號：&nbsp;&ensp;&emsp;&emsp;      <input type="text" name="username" id ="username" /><br/><br/>舊密碼：&emsp;&emsp;<input  
            type="password" name="oldpassword" id ="oldpassword"/><br/><br/>新密碼：&emsp;&emsp;<input  
            type="password" name="newpassword" id="newpassword"/><br/><br/> 確認新密碼：<input  
            type="password" name="checknewpassword" id="checknewpassword"/><br/><br/> <input  
            type="submit" value="修改密碼" onclick="return alter()"  class="btn btn-xl u-btn-primary g-font-size-default" >  
    </form>  
</div></div></div></section>




      <script type="text/javascript">  
            document.getElementById("username").value="<? php echo "${_SESSION["username"]}";?>"  
      </script>  
 <?php include "footer.php";?> 

    <script type="text/javascript">  
        function alter() {  
              
            var username=document.getElementById("username").value;  
            var oldpassword=document.getElementById("oldpassword").value;  
            var newpassword=document.getElementById("newpassword").value;  
            var checknewpassword=document.getElementById("checknewpassword").value;  
            var regex=/^[/s]+$/;  
            if(regex.test(username)||username.length==0){  
                alert("帳號格式不對");  
                return false;  
            }  
            if(regex.test(oldpassword)||oldpassword.length==0){  
                alert("密碼格式不對");  
                return false;  
            }  
            if(regex.test(newpassword)||newpassword.length==0) {  
                alert("新密碼格式不對");  
                return false;  
            }  
            if (checknewpassword != newpassword||checknewpassword==0) {  
                alert("兩次密碼輸入不一致");  
                return false;  
            }  
            return true;  
  
        }  
    </script>   
</body>  
</html>  

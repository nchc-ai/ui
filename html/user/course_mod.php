<?php
include "../session.php";
$PageName=basename($_SERVER["SCRIPT_FILENAME"],'.php');
?>
<!DOCTYPE html>
<html>
<head>
<title><?php echo $_SESSION['username'];?>@AI企業教育列車</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<?php include "includecss.php";?>
</head>
<body style="font-family:微軟正黑體">

<main>
<?php include "menu.php";?>

	<section class="g-bg-gray-dark-v1 g-color-white g-py-20">
		<div class="container">
			<div class="d-sm-flex text-center">
				<div class="align-self-center">
					<h2 class="h3 g-font-weight-300 w-100 g-mb-10 g-mb-0--md"><b><?php echo $_SESSION['username'];?>的課程清單&nbsp;<a href="course_create.php" class="btn u-btn-red g-mb-2">新增</a>

</b></h2>
				</div>
	<div class="align-self-center">
<form action="upload.php" method="post" enctype="multipart/form-data">
    <!-- 限制上傳檔案的最大值 -->
    <input type="hidden" name="MAX_FILE_SIZE" value="53687091200"> 
    <!-- accept 限制上傳檔案類型 
    <input type="file" name="file" accept="image/jpeg,image/jpg,image/gif,image/png">-->
    <input type="file"  name="file[]" accept=".7z,.tar,.zip,.tar.gz,.gz,.rar" multiple>
    資料夾名稱：<input type="text" name="folder" size="10">
 
    <input type="submit" class="btn u-btn-red g-mb-2" value="上傳檔案">
</form>
	</div>
			</div>
		</div>
	</section>

<!--<form method="post" action="./job_new.php" onsubmit="javascript:return WebForm_OnSubmit();" id="ctl00">-->
<script type="text/javascript">
var theForm = document.forms['ctl00'];
if (!theForm) {
    theForm = document.ctl00;
}
function __doPostBack(eventTarget, eventArgument) {
    if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
        theForm.__EVENTTARGET.value = eventTarget;
        theForm.__EVENTARGUMENT.value = eventArgument;
        theForm.submit();
    }
}
Sys.WebForms.PageRequestManager._initialize('ctl01', 'ctl00', ['tctl02','ctl02'], [], [], 90, '');
</script>

<script type="text/javascript">
//<![CDATA[
function WebForm_OnSubmit() {
if (typeof(ValidatorOnSubmit) == "function" && ValidatorOnSubmit() == false) return false;
return true;
}
//]]>
</script>

	<section class="container g-pt-40 g-pb-40">
		<div class="row">
			<div class="col-lg-12 g-mb-10">
				<div align="center">
					<div id="ctl02">
	
					<div>
<?php

                $sql="select * from `course` where `user_id`='".$_SESSION['aid']."' ";
                $result = mysqli_query($conn, $sql);
                $rownum = mysqli_num_rows($result);
                if ( $rownum > 0 ){
                     echo '<table cellspacing="0" cellpadding="4" rules="all" class="table table-bordered table-hover" border="1" id="GV" style="border-collapse:collapse;"><tr><th scope="col">No.</th><th scope="col"><a href="javascript:__doPostBack(&#39;GV&#39;,&#39;Sort$課程名稱&#39;)">課程名稱</a></th><th scope="col"><a href="javascript:__doPostBack(&#39;GV&#39;,&#39;Sort$job_id&#39;)">Docker Image</a></th><th scope="col"><a href="javascript:__doPostBack(&#39;GV&#39;,&#39;Sort$job_id&#39;)">Dataset</a></th><th scope="col"><a href="javascript:__doPostBack(&#39;GV&#39;,&#39;Sort$job_id&#39;)">更新日期</a></th><th scope="col"><a href="javascript:__doPostBack(&#39;GV&#39;,&#39;Sort$job_id&#39;)">帳號</a></th><th scope="col"><a href="javascript:__doPostBack(&#39;GV&#39;,&#39;Sort$job_id&#39;)">密碼</a></th><th scope="col"><a href="javascript:__doPostBack(&#39;GV&#39;,&#39;Sort$job_id&#39;)">產生容器</a></th><th scope="col"><a href="javascript:__doPostBack(&#39;GV&#39;,&#39;Sort$job_id&#39;)">伺服器</a></th></tr>';

	$job_num=1;
                    while ($row = mysqli_fetch_assoc($result)) {
        $post_di_id_array=explode(":",$row['docker_name']);
        $post_docker_image_name=$post_di_id_array[0];
        $post_docker_image_tag=$post_di_id_array[1];

                         echo '<tr><form method="post" action="./job_new.php"><td align="center" style="width:30px;">'.$job_num.'</td><td><a href="course_one.php?course_id='.$row['id'].'">'.$row['course_name'].'</a><input type="hidden" name="course_id" value="'.$row['id'].'"/></td><td><span type="text">'.$post_docker_image_name.":".$post_docker_image_tag.'</span><input type="hidden" name="DDL_di_id" value="'.$row['docker_name'].'"/></td><td><span>'.$row['dataset'].'</span></td><input type="hidden" name="dataset_course" value="'.$row['dataset'].'"/></td><td><span>'.$row['update_time'].'</span><input type="hidden" name="update_time" value="'.$row['update_time'].'"/></td><td><input name=gateway_id type="text" style="width:90px;"/></td><td><input name=gateway_password type="password" style="width:90px;"/></td><td><button type="submit" value="sub" style="background-color:#72c02c;color:white;">建立</button>';
                        echo '<td><select name="docker_server" id="docker_server">';
                        $sqlhost="select * from `host`";
                                            $resulthost = mysqli_query($conn, $sqlhost);
                                            while ($rowhost = mysqli_fetch_assoc($resulthost)) {
                                            echo '<option value="'.$rowhost['ip'].'">'.$rowhost['name'].'</option>';
                                            }
                        echo '</td></form></tr>';
        $job_num+=1;
                    }
                }
?>
		</table>
	</div>
					
					
</div>
				</div>
			</div>
		</div>
	</section>
<!--	</form>-->
<?php include "footer.php";?>
</main>
<div class="u-outer-spaces-helper"></div>
<?php include "includejs.php";?>
<?php include "docker_restful.php";?>
<!-- JS Plugins Init. -->
<script>
$(document).on('ready', function () {

	// initialization of go to
	$.HSCore.components.HSGoTo.init('.js-go-to');

	// initialization of tabs
	$.HSCore.components.HSTabs.init('[role="tablist"]');

	// initialization of counters
	var counters = $.HSCore.components.HSCounter.init('[class*="js-counter"]');

	// initialization of popups
	$.HSCore.components.HSPopup.init('.js-fancybox', {
	  transitionEffect: false
	});

//	$("button").click(function(){
//                var user = prompt("帳號:","");
//                var pass = prompt("密碼:","");
//                if (user=="" || user==null || pass== "" || pass==null){alert("Please enter both 帳號 and 密碼");
//                }
//		else{
//			var diname = "<?php echo $post_docker_image_name?>";
//			var ditag = "<?php echo $post_docker_image_tag?>";
//			var a = "<?php echo docker_ps()?>";
//			alert("Create success!");
//			document.location.href="job.php";
//		}
//	
//	});
//
//});



  $(window).on('load', function () {
	// initialization of header
	$.HSCore.components.HSHeader.init($('#js-header'));
	$.HSCore.helpers.HSHamburgers.init('.hamburger');

	// initialization of HSMegaMenu component
	$('.js-mega-menu').HSMegaMenu({
	  event: 'hover',
	  pageContainer: $('.container'),
	  breakpoint: 991
	});
  });

  $(window).on('resize', function () {
	setTimeout(function () {
	  $.HSCore.components.HSTabs.init('[role="tablist"]');
	}, 200);
  });
</script>

</body>
</html>

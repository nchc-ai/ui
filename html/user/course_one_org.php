<?php
include "../session.php";
$PageName=basename($_SERVER["SCRIPT_FILENAME"],'.php');
if ( isset($_GET['course_id'])){
    $course_id = addslashes($_GET['course_id']);
    $sqlcourse="select * from `course` where `user_id`='".$_SESSION['aid']."' AND `id`='".$course_id."';";
    $resultcourse = mysqli_query($conn, $sqlcourse);
    $rownumcourse = mysqli_num_rows($resultcourse);
    if ( $rownumcourse > 0 ){
        $rowcourse = mysqli_fetch_assoc($resultcourse);
    }else{

        header("Location:course.php");
        exit;
    }
}else{
    header("Location:course.php");
    exit;
}
?>

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

<main>
<?php include "menu.php";?>

	<section class="g-bg-gray-dark-v1 g-color-white g-py-20">
		<div class="container">
			<div class="d-sm-flex text-center">
				<div class="align-self-center">
					<h2 class="h3 g-font-weight-300 w-100 g-mb-10 g-mb-0--md"><b><?php echo $_SESSION['username']?>的課程清單</b> <a href=job_create.php class='btn u-btn-red g-mb-2'>新增</a></h2>
				</div>
				
				<div class="align-self-center ml-auto">
					<ul class="u-list-inline">
						<li class="list-inline-item g-mr-5" style="font-size:20px;"><b><span id="L_GPU"></span></b></li>
					</ul>
				</div>
			</div>
		</div>
	</section>	
</div>

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
</script>

<?php
    if ( isset($rowcourse)){ 
        $post_di_id_array=explode(":",$rowcourse['docker_name']);
        $post_docker_image_name=$post_di_id_array[0];
        $post_docker_image_tag=$post_di_id_array[1];
        $post_mode=$post_di_id_array[2];
        $post_docker_image_id=$post_di_id_array[3];
        echo '
	<form method="post" action="./job.php" id="ctl00">
	<section class="container g-pt-40 g-pb-10">
		<div class="row">
			<div class="col-lg-12 g-mb-20">			
				<div class="form-group g-mb-20" style="font-weight:bold;">課程名稱</div>'."\n";
	echo '			<div class="form-group g-mb-20"><input name="course_name" type="text" maxlength="255" id="course_name" class="form-control" required="" autocomplete="false" value='.$rowcourse['course_name'].' /></div>'."\n";			
	echo '			<div class="form-group g-mb-20" style="font-weight:bold;">課程介紹</div>'."\n";
	echo '			<div class="form-group g-mb-20"><textarea name="course_intro" rows="8" cols="20" id="course_intro" class="form-control" required="" autocomplete="false">'.$rowcourse['course_intro'].'</textarea></div>'."\n";
        echo '                  <div class="form-group g-mb-20" style="font-weight:bold;">Docker Image</div>
                                <div class="form-group g-mb-20"><select name="DDL_di_id" id="DDL_di_id" class="form-control">';
        $sql="select * from `docker_image`";
        $result = mysqli_query($conn, $sql);
        while ($row = mysqli_fetch_assoc($result)) {
            if ( $post_docker_image_name == $row['name'] && $post_docker_image_tag == $row['tag'])
                echo '<option value="'.$row['name'].':'.$row['tag'].':'.$row['mode'].':'.$row['di_id'].'" selected>'.$row['name'].' '.$row['tag'].'</option>'."\n";
            else
                echo '<option value="'.$row['name'].':'.$row['tag'].':'.$row['mode'].':'.$row['di_id'].'">'.$row['name'].' '.$row['tag'].'</option>'."\n";
        }
        echo '</select></div>';
	echo '			<div class="form-group g-mb-20" style="font-weight:bold;">訓練資料</div>'."\n";
        echo '                  <div class="form-group g-mb-20">'.$rowcourse['dataset'].' </div>';
        echo '
			</div>
		</div>
	</section>';
     }

?>
	<section class="container g-pt-40 g-pb-40">
		<div class="row">
			<div class="col-lg-12 g-mb-10">
<?php
                $sql="select * from `job` where `aid`='".$_SESSION['aid']."' AND `course_id`='".$course_id."' AND `course_template`='1';";
                $result = mysqli_query($conn, $sql);
                $rownum = mysqli_num_rows($result);
                if ( $rownum > 0 ){
                    echo '<div class="form-group g-mb-20" style="font-weight:bold;">範本容器</div>
                                <div align="center">
                                        <div id="ctl02">';
                    $ReplaseStrArr=array("start"=>"&nbsp;啟動&nbsp;&nbsp;","stop"=>"&nbsp;停止&nbsp;&nbsp;");
                    echo '<table cellspacing="0" cellpadding="4" rules="all" class="table table-bordered table-hover" border="1" id="GV" style="border-collapse:collapse;">'."\n";
                    echo '<tr><th>No.</th><th>狀態</th><th>Image Name</th><th>Tag</th><th>硬體</th><th>建立者</th><th>建立日期時間</th></tr>'."\n";
                    while ($row = mysqli_fetch_assoc($result)) {
                        $Port8000=$row['job_id']+8000;
                        $Port6000=$row['job_id']+6000;
                        $Port5000=$row['job_id']+5000;
                        $mode="";
                        if($row['mode'] == '1' ){
                              $mode='<a target=_blank href=http://140.110.16.29:'.$Port5000.'>Digits</a>';
                        }elseif($row['mode'] == '2'){
                              $mode='<a target=_blank href=http://140.110.16.29:'.$Port8000.'>Jupyter</a>';
                              //'&nbsp;&nbsp;<a target=_blank href=http://140.110.16.29:'.$Port6000.'>D</a>';
                        }else{
                              $mode='<a target=_blank href=http://140.110.16.29:'.$Port8000.'>J</a>';
                        } 
                        $docker_id_arr=explode(":",$row['di_id']);
                        $docker_name=$docker_id_arr[0];
                        $docker_tag=str_replace("v","",$docker_id_arr[1]);
                        if ( $row['status'] == 'start' ){
	                    echo '<tr><td>'.$row['job_id'].'</td><td><span>'.$ReplaseStrArr[$row['status']].'<a href=job_stop.php?redir='.$PageName.'&job_id='.$row['job_id'].' class="btn btn-sm u-btn-primary g-mr-0 g-mb-0">停止</a> &nbsp; <a href=job_edit.php?redir='.$PageName.'&job_id='.$row['job_id'].' class="btn btn-sm u-btn-primary g-mr-0 g-mb-0">編輯</a> &nbsp;'.$mode.'</span></td><td><span>'.$docker_name.'</span></td><td><span>v<input id="docker_tag-'.$row['job_id'].'" maxlength="5" size="5" type="text" value="'.$docker_tag.'"></span><button type="button" id="commit-'.$row['job_id'].'-'.$docker_tag.'" style="background-color:#72c02c;color:white;">commit</button></td><td><span>'.$row['hardware'].'</span></td><td>'.$row['id'].'</td><td>'.$row['dt_create'].'</td></tr>'."\n";
                        }elseif( $row['status'] == 'stop' ){
                            echo '<tr><td>'.$row['job_id'].'</td><td><span>'.$ReplaseStrArr[$row['status']].'<a href=job_del.php?redir='.$PageName.'&job_id='.$row['job_id'].' class="btn btn-sm u-btn-primary g-mr-0 g-mb-0">刪除</a> &nbsp; <a href=job_edit.php?redir='.$PageName.'&job_id='.$row['job_id'].' class="btn btn-sm u-btn-primary g-mr-0 g-mb-0">編輯</a> &nbsp; </td><td><span>'.$docker_name.'</span></td><td><span>v'.$docker_tag.'</span></td><td><span>'.$row['hardware'].'</span></td><td>'.$row['id'].'</td><td>'.$row['dt_create'].'</td></tr>'."\n";
                        }
                    }
		    echo '</table>'."\n";
                }else{
                    //echo 'UserName'
                    echo '<div class="form-group g-mb-20" style="font-weight:bold;">產生範本容器</div>';
                    echo '<div align="left">
                                        <div id="ctl02">';
                    echo '伺服器
                          <select name="docker_server" id="docker_server">';
                    $sqlhost="select * from `host`";
                    $resulthost = mysqli_query($conn, $sqlhost);
                    while ($rowhost = mysqli_fetch_assoc($resulthost)) {
                        echo '<option value="'.$rowhost['ip'].'">'.$rowhost['name'].'</option>';
                    }
                    echo '</select>';
                    echo ' 帳號 <input id="iusername" /> 密碼 <input id="ipasswd" /> <button type="button" id="create_template_container" style="background-color:#72c02c;color:white;">建立</button> <br><br>';
                }
?>
                                       </div>				
				</div>
<?php
echo '                  <input type="submit" name="Button_Submit" value="修改" id="Button_Submit" class="btn btn-xl u-btn-primary g-font-size-default" />
                                <a class="btn btn-xl u-btn-primary g-font-size-default" href="course.php">回上頁</a>';
?>
			</div>
		</div>
	</section>
	</form>
	
<?php include "footer.php";?>
</main>
<div class="u-outer-spaces-helper"></div>
<?php include "includejs.php";?>
<!-- JS Plugins Init. -->
<script>
$(document).on('ready', function () {

        function blockbox(){
            $('#ctl02').block({ 
                message: '<h1>Processing</h1>', 
                css: { border: '3px solid #a00' } 
            }); 
        }

        function unblockbox(){
            $('#ctl02').unblock();
        }
	// initialization of go to
	$.HSCore.components.HSGoTo.init('.js-go-to');

	// initialization of tabs
	$.HSCore.components.HSTabs.init('[role="tablist"]');

	// initialization of counters
	var counters=$.HSCore.components.HSCounter.init('[class*="js-counter"]');

	// initialization of popups
	$.HSCore.components.HSPopup.init('.js-fancybox', {
	  transitionEffect: false
	});
          
        $("button").click(function(){
             var job_id=this.id.split("-")[1];
             var tag_id=this.id.split("-")[2];
             blockbox();
             if ( $("#docker_tag-"+job_id).val() == tag_id ){
                 unblockbox();
                 alert("Please Change Tag Number!!");
             }else{
                 $.ajax({
                   url: 'job_commit.php',
                   type: 'GET',
                   data: {
                     'job_id':job_id,'commit_tag':'v'+$("#docker_tag-"+job_id).val()
                   },
                   error: function(xhr) {
                     unblockbox();
                     alert('Ajax request 發生錯誤');
                   },
                   success: function(response) {
                       //$('#msg_user_name').html(response);
                       //$('#msg_user_name').fadeIn();
                       unblockbox();
                       alert('commit success');
                
                   }
                 });
             }
        });
        
  });

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

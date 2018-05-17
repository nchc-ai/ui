<?php
include "../session.php";
include "docker_restful.php";
$PageName=basename($_SERVER["SCRIPT_FILENAME"],'.php');
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
					<h2 class="h3 g-font-weight-300 w-100 g-mb-10 g-mb-0--md"><b><?php echo $_SESSION['username']?>的工作清單</b> <a href=job_create.php class='btn u-btn-red g-mb-2'>新增</a></h2>
				</div>
				
				<div class="align-self-center ml-auto">
					<ul class="u-list-inline">
						<li class="list-inline-item g-mr-5" style="font-size:20px;"><b><span id="L_GPU"></span></b></li>
					</ul>
				</div>
			</div>
		</div>
	</section>	

	<form method="post" action="./job.php" id="ctl00">
</div>

<script type="text/javascript">
//<![CDATA[
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
//]]>
</script>

	<script type="text/javascript">
//<![CDATA[
Sys.WebForms.PageRequestManager._initialize('ctl01', 'ctl00', ['tctl02','ctl02'], [], [], 90, '');
//]]>
</script>

	<section class="container g-pt-40 g-pb-40">
		<div class="row">
			<div class="col-lg-12 g-mb-10">
				<div align="center">
					
					<div id="ctl02">
	
<?php
                $sql="select * from `job` where `aid`='".$_SESSION['aid']."' AND `course_template`='0';";
                $result = mysqli_query($conn, $sql);
                $rownum = mysqli_num_rows($result);
		$job_num=1;
                if ( $rownum > 0 ){

                    $ReplaseStrArr=array("start"=>"&nbsp;啟動&nbsp;&nbsp;","stop"=>"&nbsp;停止&nbsp;&nbsp;");
                    echo '<table cellspacing="0" cellpadding="4" rules="all" class="table table-bordered table-hover" border="1" id="GV" style="border-collapse:collapse;">'."\n";
                    echo '<tr><th>No.</th><th>狀態</th><th>課程名稱</th><th>Docker Image</th><th>data set</th><th>建立者</th><th>建立日期時間</th></tr>'."\n";
                    while ($row = mysqli_fetch_assoc($result)) {
                        $Port8000=$row['job_id']+8000;
                        $Port6000=$row['job_id']+6000;
                        $Port5000=$row['job_id']+5000;
			$Port10000=$row['job_id']+10000;
                        $mode="";
                        if($row['mode'] == '1' ){
                              $mode='<a target=_blank href=http://140.110.16.29:'.$Port5000.'>Digits</a>';
                        }elseif($row['mode'] == '2'){
                              $mode='<a target=_blank href=http://140.110.16.29:'.$Port8000.'>Jupyter</a>';
                         //'&nbsp;&nbsp;<a target=_blank href=http://140.110.16.29:'.$Port6000.'>Dashboard</a>';
                        }else{
                              $mode='<a target=_blank href=http://140.110.16.29:'.$Port10000.'>Terminal</a>';
                        } 
                	$sql_course="select * from `course` where `user_id`='".$_SESSION['aid']."' AND `id`='".$row['course_id']."'; ";
	                $result_course = mysqli_query($conn, $sql_course);
        	        $row_course = mysqli_fetch_assoc($result_course);
			if (isset($row_course['course_name'])==0){$row_course['course_name']="Course Removed!";}
                        if ( $row['status'] == 'start' ){
	                    echo '<tr><td>'.$job_num.'</td><td><span>'.$ReplaseStrArr[$row['status']].'<a href=job_stop.php?job_id='.$row['job_id'].' class="btn btn-sm u-btn-primary g-mr-0 g-mb-0">停止</a> &nbsp;<a href=job_edit.php?job_id='.$row['job_id'].'&di='.$row['di_id'].' class="btn btn-sm u-btn-primary g-mr-0 g-mb-0">編輯</a> &nbsp;'.$mode.'</span></td><td><span>'.$row_course['course_name'].'</span></td><td><span>'.$row['di_id'].'</span></td><td><span>'.$row['dataset'].'</span></td><td>'.$row['id'].'</td><td>'.$row['dt_create'].'</td></tr>'."\n";
                        }elseif( $row['status'] == 'stop' ){
                            echo '<tr><td>'.$job_num.'</td><td><span>'.$ReplaseStrArr[$row['status']].'<a href=job_del.php?job_id='.$row['job_id'].' class="btn btn-sm u-btn-primary g-mr-0 g-mb-0">刪除</a> &nbsp;<a href=job_edit.php?job_id='.$row['job_id'].'&di='.$row['di_id'].' class="btn btn-sm u-btn-primary g-mr-0 g-mb-0">編輯</a> &nbsp; </td><td><span>'.$row_course['course_name'].'</span></td><td><span>'.$row['di_id'].'</span></td><td><span>'.$row['dataset'].'</span></td><td>'.$row['id'].'</td><td>'.$row['dt_create'].'</td></tr>'."\n";
                        }
  		$job_num+=1;
                    }
		echo '</table>'."\n";
                }
?>					
					
</div>				
<div id="terminal"></div>
				</div>
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

var term = new Terminal({
        cursorBlink: true
    });
    term.open(document.getElementById('terminal'));
    term.writeln("Welcome!")
    var socket = new WebSocket('ws://localhost/ws/terminal');
    term.attach(socket);
    socket.onclose = function () {
        term.writeln("closed. Bye!");
    };


$(document).on('ready', function () {
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

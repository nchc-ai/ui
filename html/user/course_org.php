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
					<h2 class="h3 g-font-weight-300 w-100 g-mb-10 g-mb-0--md"><b><?php echo $_SESSION['username'];?>的課程清單&nbsp;<a href="course_create.php" class="btn u-btn-red g-mb-2">新增</a></b></h2>
				</div>
			</div>
		</div>
	</section>

	<form method="post" action="./course.aspx" id="ctl00">
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
                     echo '<table cellspacing="0" cellpadding="4" rules="all" class="table table-bordered table-hover" border="1" id="GV" style="border-collapse:collapse;"><tr><th scope="col">No.</th><th scope="col"><a href="javascript:__doPostBack(&#39;GV&#39;,&#39;Sort$課程名稱&#39;)">課程名稱</a></th><th scope="col"><a href="javascript:__doPostBack(&#39;GV&#39;,&#39;Sort$job_id&#39;)">Docker Image</a></th><th scope="col"><a href="javascript:__doPostBack(&#39;GV&#39;,&#39;Sort$job_id&#39;)">建立日期</a></th></tr>';

                    while ($row = mysqli_fetch_assoc($result)) {
        $post_di_id_array=explode(":",$row['docker_name']);
        $post_docker_image_name=$post_di_id_array[0];
        $post_docker_image_tag=$post_di_id_array[1];

                         echo '<tr><td align="center" style="width:30px;">'.$row['id'].'</td><td><a href="course_one.php?course_id='.$row['id'].'">'.$row['course_name'].'</a></td><td><span>'.$post_docker_image_name.":".$post_docker_image_tag.'</span></td><td><span>'.$row['update_time'].'</span></td></tr>'."\n";
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
	</form>
<?php include "footer.php";?>
</main>
<div class="u-outer-spaces-helper"></div>
<?php include "includejs.php";?>
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

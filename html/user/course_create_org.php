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
					<h2 class="h3 g-font-weight-300 w-100 g-mb-10 g-mb-0--md"><b><a href="course.php"><?php echo $_SESSION['username'];?>的課程清單</a></b> <b><i class="ace-icon fa fa-angle-double-right"></i> 新增</b></h2>
				</div>
			</div>
		</div>
	</section>

	<form method="post" action="./course_new.php" id="ctl00">

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
	<section class="container g-pt-40 g-pb-10">
		<div class="row">
			<div class="col-lg-12 g-mb-20">			
				<div class="form-group g-mb-20" style="font-weight:bold;">課程名稱</div>
				<div class="form-group g-mb-20"><input name="course_name" type="text" maxlength="255" id="course_name" class="form-control" required="" autocomplete="false" /></div>			
				<div class="form-group g-mb-20" style="font-weight:bold;">課程介紹</div>
				<div class="form-group g-mb-20"><textarea name="course_intro" rows="8" cols="20" id="course_intro" class="form-control" required="" autocomplete="false">
</textarea></div>				
				<div class="form-group g-mb-20" style="font-weight:bold;">Docker Image</div>
				<div class="form-group g-mb-20"><select name="DDL_di_id" id="DDL_di_id" class="form-control">
<?php
    $sql="select * from `docker_image`";
    $result = mysqli_query($conn, $sql);
    while ($row = mysqli_fetch_assoc($result)) {
        echo '<option value="'.$row['name'].':'.$row['tag'].':'.$row['mode'].':'.$row['di_id'].'">'.$row['name'].' '.$row['tag'].'</option>'."\n";
    }
?>
</select></div>
				<div class="form-group g-mb-20" style="font-weight:bold;">訓練資料</div>
				<div class="form-group g-mb-20">
					<table id="CBL">
<?php
    $Count=0;
    unset($output);
    exec("cd /tmp; wget https://aidm.nchc.org.tw/dataset;cat /tmp/dataset | grep '<a href=\"/dataset/' | grep -v 'demo' | cut -d'\"' -f2 | uniq | sed 's/\/dataset\///g'",$output);
    foreach( $output as $dataset){
        echo '<tr><td><input id="DSet'.$Count.'" type="checkbox" name="DSet'.$Count.'" value="'.$dataset.'" /><label for="DSet'.$Count.'">'.$dataset.'</label></td></tr>'."\n";
        $Count++;
    }
    echo '</table>'."\n";
    echo '<input type="hidden" id="DSetCount" name="DSetCount"  value="'.$Count.'">'."\n";
?>
				</div>
				<input type="submit" name="Button_Submit" value="確定" id="Button_Submit" class="btn btn-xl u-btn-primary g-font-size-default" />
				<a class="btn btn-xl u-btn-primary g-font-size-default" href="course.php">回上頁</a>
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

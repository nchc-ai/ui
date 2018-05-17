<?php
include "../session.php";
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
					<h2 class="h3 g-font-weight-300 w-100 g-mb-10 g-mb-0--md"><b><a href="job.php"><?php echo $_SESSION['username'];?>的工作清單</a> <i class="ace-icon fa fa-angle-double-right"></i> 新增</b></h2>
				</div>
			</div>
		</div>
	</section>
	
	<form method="post" action="./job_update.php" onsubmit="javascript:return WebForm_OnSubmit();" id="ctl00">

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
function WebForm_OnSubmit() {
if (typeof(ValidatorOnSubmit) == "function" && ValidatorOnSubmit() == false) return false;
return true;
}
//]]>
</script>

	<section class="container g-pt-40 g-pb-10">
		<div class="row">
			<div class="col-lg-12 g-mb-20">
				<div class="form-group g-mb-20">
                                        <input type="hidden" id="job_id" name="job_id" value="<?php echo $_GET['job_id'];?>">
					Container 帳號 <font color="red"><b>必填</b></font> &nbsp; 

					<a href="#modal1" data-modal-target="#modal1" data-modal-effect="fadein"><i class="ace-icon fa fa-info-circle"></i></a> 
					<div id="modal1" class="text-left g-max-width-600 g-bg-white g-overflow-y-auto g-pa-10" style="display: none;"> 
						<button type="button" class="close" onclick="Custombox.modal.close();"> <i class="hs-icon hs-icon-close"></i> </button> 
						<h4 class="g-mb-20">Container 帳號</h4> 
					</div>
					
					<input name="gateway_id" type="text" value="" maxlength="255" id="gateway_id" class="form-control" required="" autocomplete="false" />
					<span id="ctl01" style="visibility:hidden;"><font color=red><b>Alphanumeric only!</b></font></span>
				</div>
				<div class="form-group g-mb-20">
					Container 密碼 <font color="red"><b>必填</b></font> &nbsp; 
					
					<a href="#modal2" data-modal-target="#modal2" data-modal-effect="fadein"><i class="ace-icon fa fa-info-circle"></i></a> 
					<div id="modal2" class="text-left g-max-width-600 g-bg-white g-overflow-y-auto g-pa-10" style="display: none;"> 
						<button type="button" class="close" onclick="Custombox.modal.close();"> <i class="hs-icon hs-icon-close"></i> </button> 
						<h4 class="g-mb-20">Container 密碼</h4> 
<br/>
</p>
					</div>
					
					<input name="gateway_password" value="" maxlength="255" id="gateway_password" class="form-control" type="password" required="" autocomplete="new-password" />
					<span id="ctl02" style="visibility:hidden;"><font color=red><b>Alphanumeric only!</b></font></span>
				</div>
<!--				<div class="form-group g-mb-20">
					進階設定：來源 IP Address (可以不指定) 
					
					<a href="#modal3" data-modal-target="#modal3" data-modal-effect="fadein"><i class="ace-icon fa fa-info-circle"></i></a> 
					<div id="modal3" class="text-left g-max-width-600 g-bg-white g-overflow-y-auto g-pa-10" style="display: none;"> 
						<button type="button" class="close" onclick="Custombox.modal.close();"> <i class="hs-icon hs-icon-close"></i> </button> 
						<h4 class="g-mb-20">來源 IP Address</h4> 
						<p>一列一筆，只接受單一 IP Address (e.g., 140.110.27.125) 與 C 級子網路(e.g., 140.110.27)<br/>
範例: <br/>
140.110.1.1<br/>
140.110.1</p>
					</div>
					
					<input name="source_ip_address" type="text" maxlength="255" id="source_ip_address" class="form-control" autocomplete="false" />
				</div>
-->				
				<input type="submit" name="Button_Submit" value="確定" onclick="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;Button_Submit&quot;, &quot;&quot;, true, &quot;&quot;, &quot;&quot;, false, false))" id="Button_Submit" class="btn btn-xl u-btn-primary g-font-size-default" />
				<a class="btn btn-xl u-btn-primary g-font-size-default" href="job.php">回上頁</a>
			</div>
		</div>
	</section>
	
<script type="text/javascript">
//<![CDATA[
var Page_Validators =  new Array(document.getElementById("ctl01"), document.getElementById("ctl02"), document.getElementById("ctl03"));
//]]>
</script>

<script type="text/javascript">
//<![CDATA[
var ctl01 = document.all ? document.all["ctl01"] : document.getElementById("ctl01");
ctl01.controltovalidate = "gateway_id";
ctl01.errormessage = "<font color=red><b>Alphanumeric only!</b></font>";
ctl01.evaluationfunction = "RegularExpressionValidatorEvaluateIsValid";
ctl01.validationexpression = "^[A-Za-z0-9]*$";
var ctl02 = document.all ? document.all["ctl02"] : document.getElementById("ctl02");
ctl02.controltovalidate = "gateway_password";
ctl02.errormessage = "<font color=red><b>Alphanumeric only!</b></font>";
ctl02.evaluationfunction = "RegularExpressionValidatorEvaluateIsValid";
ctl02.validationexpression = "^[A-Za-z0-9]*$";
var ctl03 = document.all ? document.all["ctl03"] : document.getElementById("ctl03");
ctl03.controltovalidate = "source_ip_address";
ctl03.errormessage = "<font color=red>格式不正確！</font>";
ctl03.evaluationfunction = "RegularExpressionValidatorEvaluateIsValid";
ctl03.validationexpression = "^[0-9.,]{1,255}$";
//]]>
</script>


<script type="text/javascript">
//<![CDATA[

var Page_ValidationActive = false;
if (typeof(ValidatorOnLoad) == "function") {
    ValidatorOnLoad();
}

function ValidatorOnSubmit() {
    if (Page_ValidationActive) {
        return ValidatorCommonOnSubmit();
    }
    else {
        return true;
    }
}
        WebForm_AutoFocus('id');//]]>
</script>
</form>
<?php include "footer.php";?>
</main>
<div class="u-outer-spaces-helper"></div>
<?php include "includejs.php";?>
<!-- JS Plugins Init. -->
<script>
$(document).on('ready', function () {
	$.HSCore.components.HSModalWindow.init('[data-modal-target]');
	
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

<?php
include "../closedb.php";

?>

<?php
    if ( isset($_POST['username']) && isset($_POST['password']) ){
        include "db.php";
        $conn = mysqli_connect($DBHost ,$DBUser ,$DBPasswd ,$DBName);
        $sql = "select * from `user` where `id`='".$_POST['username']."';";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);
        if ( $row['id'] == $_POST['username']  && $row['password'] == $_POST['password']) {
            $Login = TRUE;
        }else{
            header('Location: index.php');
            exit;
        }
         
        if ( $Login == TRUE ){   
             session_start();
             #session_register('authenticated');
             #session_register('fruits');
             #session_register('login_time');

             $_SESSION['authenticated'] = true;
             $_SESSION['aid'] = $row['aid'];
             $_SESSION['id'] = $row['id'];
             $_SESSION['username'] = $row['name'];
             $_SESSION['admin_level'] = $row['admin_level'];
             $_SESSION['container_limit'] = $row['container_limit'];
             $_SESSION['gatewayip'] = '140.110.16.29';
             $_SESSION['login_time'] = date('Y-m-d h:i:s');
             if(isset($_SESSION['UrlRedirect'])){
                    $redir = $_SESSION['UrlRedirect'];
             }else{
                    $redir = 'user/job.php';
             }
             header("Location: $redir");
             exit;
        }
    }
?>
<!DOCTYPE html>
<html>
<head>
<title>首頁@企業列車</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<!-- Favicon -->
<link rel="shortcut icon" href="favicon.ico">
<!-- Google Fonts -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700">
<!-- CSS Global Compulsory -->
<link rel="stylesheet" href="assets/vendor/bootstrap/bootstrap.min.css">
<!-- CSS Global Icons -->
<link rel="stylesheet" href="assets/vendor/icon-awesome/css/font-awesome.min.css">
<link rel="stylesheet" href="assets/vendor/icon-line/css/simple-line-icons.css">
<link rel="stylesheet" href="assets/vendor/icon-etlinefont/style.css">
<link rel="stylesheet" href="assets/vendor/icon-line-pro/style.css">
<link rel="stylesheet" href="assets/vendor/icon-hs/style.css">
<link rel="stylesheet" href="assets/vendor/slick-carousel/slick/slick.css">
<link rel="stylesheet" href="assets/vendor/jquery-ui/themes/base/jquery-ui.min.css">
<link rel="stylesheet" href="assets/vendor/chosen/chosen.css">
<link rel="stylesheet" href="assets/vendor/hs-megamenu/src/hs.megamenu.css">
<link rel="stylesheet" href="assets/vendor/hamburgers/hamburgers.min.css">
<link rel="stylesheet" href="assets/vendor/animate.css">
<link  rel="stylesheet" href="assets/vendor/custombox/custombox.min.css">
<!-- CSS Unify -->
<link rel="stylesheet" href="assets/css/unify-core.css">
<link rel="stylesheet" href="assets/css/unify-components.css">
<link rel="stylesheet" href="assets/css/unify-globals.css">
<!-- CSS Customization -->
<link rel="stylesheet" href="assets/css/custom.css">
</head>
<body style="font-family:微軟正黑體">

<main>
		<header id="js-header" class="u-header u-header--static">
		<div class="u-header__section u-header__section--light g-bg-white g-transition-0_3 g-py-10">
			<nav class="js-mega-menu navbar navbar-expand-lg hs-menu-initialized hs-menu-horizontal">
				<div class="container">
					<button class="navbar-toggler navbar-toggler-right btn g-line-height-1 g-brd-none g-pa-0 g-pos-abs g-top-3 g-right-0" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navBar" data-toggle="collapse" data-target="#navBar">
						<span class="hamburger hamburger--slider">
						<span class="hamburger-box">
						<span class="hamburger-inner">
						</span>
						</span>
						</span>
					</button>
					<a href="index.php" class="navbar-brand"><img src="img/TWGC_logo.jpg" alt="Image Description"></a>
					<div class="collapse navbar-collapse align-items-center flex-sm-row g-pt-10 g-pt-5--lg g-mr-40--lg" id="navBar">
						<ul class="navbar-nav text-uppercase g-pos-rel g-font-weight-600 ml-auto" style="font-size:16px;">
							<li class="nav-item g-mx-10--lg g-mx-15--xl active"><a href="index.php" class="nav-link g-py-17 g-px-0"> <i class="ace-icon fa fa-home"></i> 首頁</a></li>
							<li class="nav-item g-mx-10--lg g-mx-15--xl"><a href="https://github.com/TW-NCHC/TWGC" target="_blank" class="nav-link g-py-17 g-px-0"> <i class="ace-icon fa fa-github"></i> NCHC Github</a></li>
							<li class="nav-item hs-has-sub-menu  g-mx-10--lg g-mx-15--xl" data-animation-in="fadeIn" data-animation-out="fadeOut">
								<a id="nav-link--features" class="nav-link g-py-17 g-px-0" href="#!" aria-haspopup="true" aria-expanded="false" aria-controls="nav-submenu--features"> <i class="ace-icon fa fa-bullhorn"></i> 最新消息</a>
								<ul class="hs-sub-menu list-unstyled u-shadow-v11 g-brd-top g-brd-primary g-brd-top-2 g-min-width-220 g-mt-18 g-mt-8--lg--scrolling" id="nav-submenu--features" aria-labelledby="nav-link--features">
									<li class="dropdown-item "><a class="nav-link" href="announce_01.php">一般公告</a></li>
									<li class="dropdown-item "><a class="nav-link" href="announce_02.php">教育訓練</a></li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	</header>

	<section class="g-bg-cover g-flex-centered g-bg-pos-top-center g-bg-img-hero g-bg-black-opacity-0_3--after" style="background-image: url(img/robot.jpg);" data-calc-target="#js-header">
		<div class="container g-bg-cover__inner g-py-100">
			<div class="row">
				<div class="col-lg-5 align-self-center g-mb-40 g-mb-0--lg">
					<div class="g-bg-white g-rounded-5 g-pa-40">
						<h3 class="h6 g-color-black g-font-weight-600 text-uppercase text-center g-mb-25"> &nbsp; AI 先期應用開發測試平臺使用者登入</h3>
						<form method="post" action="./index.php" id="ctl00">
<div class="aspNetHidden">
<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="/wEPDwUIODk5ODcwMDNkZA82Mt1aNODm/YUyjeivNPuaSzjelptsQ199HZKeIKIf" />
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


							<div class="form-group g-mb-20"></div>
							<div class="form-group g-mb-20">帳號</div>
							<div class="form-group g-mb-20"><input name="username" type="text" maxlength="255" id="username" class="form-control" required="" autocomplete="false" /></div>
							<div class="form-group g-mb-20">密碼</div>
							<div class="form-group g-mb-20"><input name="password" maxlength="255" id="password" class="form-control" type="password" required="" autocomplete="new-password" /></div>
							<input type="submit" name="Button_Submit" value="確定" id="Button_Submit" class="btn btn-lg btn-block u-btn-primary g-font-weight-600 g-font-size-13 text-uppercase g-rounded-5 g-py-13" />
							<a href="register.php" class="btn btn-lg btn-block u-btn-primary g-font-weight-600 g-font-size-13 text-uppercase g-rounded-5 g-py-13">註冊</a>
						

<script type="text/javascript">
//<![CDATA[
WebForm_AutoFocus('id');//]]>
</script>
</form>
					</div>
				</div>
			</div>
		</div>
	</section>
	
	<section class="g-pt-50 g-pb-40">
		<div class="container">
			<div class="row d-flex align-items-lg-center flex-wrap g-mb-30 g-mb-0--lg">
				<div class="col-md-6 col-lg-8"><img class="img-fluid rounded" src="img/architecture_v1.jpg" alt="AI研發平台" width="100%" class="responsive"></div>
				<div class="col-md-6 col-lg-4">
					<div class="g-mt-minus-30 g-mt-0--md g-ml-minus-80--lg">
						<div class="g-mb-20">
							<h2 class="g-color-black g-font-weight-600 g-font-size-25 g-font-size-35--lg g-line-height-1_2 mb-4 g-mt-30">AI研發平台</h2>
							<p class="g-font-size-16">科技部並責成財團法人國家實驗研究院國家高速網路與計算中心(國網中心) 建構研發服務所需之AI主機，以提供大規模共用、共享的高速運算環境，供深度學習與大數據分析的技術發展與應用開發，進而孕育AI技術服務公司，形成區域創新生態系。</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="row d-flex justify-content-between align-items-lg-center flex-wrap g-mt-20--lg">
				<div class="col-md-6 col-lg-4 ml-auto flex-md-first">
					<div class="g-mt-minus-30 g-mt-0--md g-ml-minus-100--lg">
						<div class="g-mb-20">
							<h2 class="g-color-black g-font-weight-600 g-font-size-25 g-font-size-35--lg g-line-height-1_2 mb-4 g-mt-50">雲端服務與大數據運算平台</h2>
							<p class="g-font-size-16">科技部施政目標：以學術創新支援新興產業關鍵技術，帶動創新產業，加強主力產業關鍵技術研發，以科技研發支援產業創新。串連上游學研與下游產業間之研發能量，支援重點產業技術之發展。跨部會整合產、官、學研資源，推動創新產業計畫及其它具潛力發展項目之研究。將研發能量有效導入創新產業，協助新創事業及產業發展，鬆綁研發成果運用法規，活絡產學合作研發及人才流通，加速研發成果運用及技術擴散。促進臺灣與矽谷生產供應鏈、人才、技術及資金交流，提升創新創業動能。協助創業團隊完備商業模式及營運實力，介接政府與民間創業資源。</p>
							
							
<a class="btn u-btn-primary" href="#modal1" data-modal-target="#modal1" data-modal-effect="fadein">Launch Modal </a> <!-- Demo modal window --> <div id="modal1" class="text-left g-max-width-600 g-bg-white g-overflow-y-auto g-pa-20" style="display: none;"> <button type="button" class="close" onclick="Custombox.modal.close();"> <i class="hs-icon hs-icon-close"></i> </button> <h4 class="g-mb-20">Modal title</h4> <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p> <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p> </div> <!-- End Demo modal window -->
							
						</div>
					</div>
				</div>
				<div class="col-md-6 flex-md-unordered"><div class="g-brd-around--md g-brd-10 g-brd-white rounded"><img class="img-fluid w-100 rounded" src="img/peta.jpg" alt="Peta"></div></div>
			</div>
		</div>
		<div class="container">
				<div class="col-md-12 flex-md-unordered"><div class="g-brd-around--md g-brd-10 g-brd-white rounded"><img class="img-fluid w-100 rounded" src="img/NCHC_AI.jpg" alt="NCHC AI"></div></div>
			</div>
		</div>
	</section>
	
		<div id="contacts-section" class="g-bg-black-opacity-0_9 g-color-white-opacity-0_8 g-py-60">
		<div class="container">
			<div class="row">
				<div class="col-lg-4 col-md-6 g-mb-40 g-mb-0--lg">
					<div class="u-heading-v2-3--bottom g-brd-white-opacity-0_8 g-mb-20"><h2 class="u-heading-v2__title h6 text-uppercase mb-0">執行單位</h2></div>
					<div style="margin-bottom:24px;"><img src="img/footer/NCHC.png"></div>
					<p>小國大戰略，掌握科技脈動</p>
					<p>尋找人工智慧的真理，駕馭AI 驅動方向</p>
					<p>登上AI之頂，探索未來最不可能的可能性</p>
				</div>
				<div class="col-lg-4 col-md-6 g-mb-40 g-mb-0--lg">
					<div class="u-heading-v2-3--bottom g-brd-white-opacity-0_8 g-mb-20"><h2 class="u-heading-v2__title h6 text-uppercase mb-0">指導單位</h2></div>
					<div style="margin-bottom:24px;"><img src="img/footer/MOST.png"></div>
				</div>
				<div class="col-lg-4 col-md-6">
					<div class="u-heading-v2-3--bottom g-brd-white-opacity-0_8 g-mb-20"><h2 class="u-heading-v2__title h6 text-uppercase mb-0">聯絡我們</h2></div>
					<address class="g-bg-no-repeat g-font-size-12 mb-0" style="background-image: url(assets/img/maps/map2.png);">
						<div class="d-flex g-mb-20">
							<div class="g-mr-10"><span class="u-icon-v3 u-icon-size--xs g-bg-white-opacity-0_1 g-color-white-opacity-0_6"><i class="fa fa-map-marker"></i></span></div>
							<p class="mb-0">30076 新竹市科學園區研發六路7號<br/>7, R&D 6th Rd., Hsinchu Science Park, 300, Taiwan</p>
						</div>
						<div class="d-flex g-mb-20">
							<div class="g-mr-10"><span class="u-icon-v3 u-icon-size--xs g-bg-white-opacity-0_1 g-color-white-opacity-0_6"><i class="fa fa-phone"></i></span></div>
							<p class="mb-0">(03)5776085 # 442<br/>呂小姐</p>
						</div>
						<div class="d-flex g-mb-20">
							<div class="g-mr-10"><span class="u-icon-v3 u-icon-size--xs g-bg-white-opacity-0_1 g-color-white-opacity-0_6"><i class="fa fa-globe"></i></span></div>
							<p class="mb-0"><a class="g-color-white-opacity-0_8 g-color-white--hover" href="mailto:account@nchc.narl.org.tw">account@nchc.narl.org.tw</a><br/><a class="g-color-white-opacity-0_8 g-color-white--hover" href="http://www.nchc.org.tw" target="_blank">http://www.nchc.org.tw</a></p>
						</div>
					</address>
				</div>
			</div>
		</div>
	</div>
	<footer class="g-bg-gray-dark-v1 g-color-white-opacity-0_8 g-py-20">
		<div class="container">
			<div class="row">
				<div class="col-md-12 text-center text-md-left g-mb-10 g-mb-0--md">
					<div class="d-lg-flex">
						<small class="d-block g-font-size-default g-mr-10 g-mb-10 g-mb-0--md">2018 © NCHC All Rights Reserved. &nbsp;  您是第 118 位訪客</small>
					</div>
				</div>
			</div>
		</div>
	</footer>
	<!-- End Copyright Footer -->
	<a class="js-go-to u-go-to-v1" href="#!" data-type="fixed" data-position='{"bottom": 15,"right": 15}' data-offset-top="400" data-compensation="#js-header" data-show-effect="zoomIn"><i class="hs-icon hs-icon-arrow-top"></i></a>
</main>

<!-- JS Global Compulsory -->
<script src="assets/vendor/jquery/jquery.min.js"></script>
<script src="assets/vendor/jquery-migrate/jquery-migrate.min.js"></script>
<script src="assets/vendor/popper.min.js"></script>
<script src="assets/vendor/bootstrap/bootstrap.min.js"></script>
<!-- JS Implementing Plugins -->
<script src="assets/vendor/appear.js"></script>
<script src="assets/vendor/hs-megamenu/src/hs.megamenu.js"></script>
<script src="assets/vendor/masonry/dist/masonry.pkgd.min.js"></script>
<script src="assets/vendor/imagesloaded/imagesloaded.pkgd.min.js"></script>
<script src="assets/vendor/slick-carousel/slick/slick.js"></script>
<script src="assets/vendor/chosen/chosen.jquery.js"></script>
<script src="assets/vendor/image-select/src/ImageSelect.jquery.js"></script>
<!-- JS Unify -->
<script src="assets/js/hs.core.js"></script>
<script src="assets/js/components/hs.header.js"></script>
<script src="assets/js/helpers/hs.hamburgers.js"></script>
<script src="assets/js/helpers/hs.height-calc.js"></script>
<script src="assets/js/components/hs.carousel.js"></script>
<script src="assets/js/components/hs.onscroll-animation.js"></script>
<script src="assets/js/helpers/hs.focus-state.js"></script>
<script src="assets/js/components/hs.select.js"></script>

<script src="assets/vendor/custombox/custombox.min.js"></script>
<script src="assets/js/components/hs.modal-window.js"></script>

<!-- JS Plugins Init. -->
<script>
$(document).ready(function () {
  // initialization of carousel
  $.HSCore.components.HSCarousel.init('.js-carousel');
  $.HSCore.components.HSModalWindow.init('[data-modal-target]');

  // initialization of masonry
  $('.masonry-grid').imagesLoaded().then(function () {
	$('.masonry-grid').masonry({
	  columnWidth: '.masonry-grid-sizer',
	  itemSelector: '.masonry-grid-item',
	  percentPosition: true
	});
  });

  // initialization of scroll animation
  $.HSCore.components.HSOnScrollAnimation.init('[data-animation]');

  // initialization of header's height equal offset
  $.HSCore.helpers.HSHeightCalc.init();

  // initialization of forms
  $.HSCore.components.HSSelect.init('.js-custom-select');
  $.HSCore.helpers.HSFocusState.init();
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
</script>

</body>
</html>

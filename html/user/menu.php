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
                                        <img src="../img/TWGC_logo.jpg" alt="Logo">
                                        <div class="collapse navbar-collapse align-items-center flex-sm-row g-pt-10 g-pt-5--lg g-mr-40--lg" id="navBar">
                                                <ul class="navbar-nav text-uppercase g-pos-rel g-font-weight-600 ml-auto">

<?php
                                                      if ( substr($PageName,0,3) == 'job' ){
                                                          echo '<li class="nav-item g-mx-10--lg g-mx-15--xl active">';
                                                      }else{
                                                          echo '<li class="nav-item g-mx-10--lg g-mx-15--xl">';
                                                      }

                                                      echo '<a href="job.php" class="nav-link g-py-17 g-px-0"> <i class="ace-icon fa fa-database"></i> ';
                                                      echo $_SESSION['username'].'的工作清單</a></li>';
                              
                                                      if ( substr($PageName,0,6) == 'course' ){
                                                          echo '<li class="nav-item g-mx-10--lg g-mx-15--xl active">';
                                                      }else{
                                                          echo '<li class="nav-item g-mx-10--lg g-mx-15--xl">';
                                                      }
			//		      if($_SESSION['admin_level']==3){}
			//				else{
                                                      echo '<a href="course.php" class="nav-link g-py-17 g-px-0"> <i class="ace-icon fa fa-database"></i>';
                                                      echo $_SESSION['username'].'的課程清單</a></li>';
//}
                                                      echo '<li class="nav-item g-mx-10--lg g-mx-15--xl"><a href="personal_data.aspx" class="nav-link g-py-17 g-px-0"> <i class="ace-icon fa fa-male"></i>';
                                                      echo $_SESSION['username'].'的個人資料</a></li>';

?>
                                                        <li class="nav-item  g-mx-10--lg g-mx-15--xl"><a href="project_member.aspx" class="nav-link g-py-17 g-px-0"> <i class="ace-icon fa fa-street-view"></i> 計畫人員</a></li>
                                                        <li class="nav-item g-mx-10--lg g-mx-15--xl"><a href="discuss.aspx" class="nav-link g-py-17 g-px-0"> <i class="ace-icon fa fa-commenting"></i> 討論區</a></li>
                                                        <li class="nav-item  g-mx-10--lg g-mx-15--xl"><a href="../logout.php" class="nav-link g-py-17 g-px-0"> <i class="ace-icon fa fa-power-off"></i> 登出</a></li>
                                                </ul>
                                        </div>
                                </div>
                        </nav>
                </div>
        </header>

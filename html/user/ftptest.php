<?php include "../session.php";?>
<html>
<head>

hihi
<?php
$file = 'upload_file.pdf';   ### 上傳的檔案
$fp = fopen($file, 'r');
 
### 連接的 FTP 伺服器是 localhost
$conn_id = ftp_connect('140.110.16.32');
 
### 登入 FTP, 帳號是 USERNAME, 密碼是 PASSWORD
$login_result = ftp_login($conn_id, 'chou', 'nchc@ccw');
ftp_chdir($conn_id,'mntest/datasets');
if ($login_result) {echo 'yes!';}
if (ftp_fput($conn_id, $file, $fp, FTP_ASCII)) {
    echo "成功上傳 $file\n";
} else {
    echo "上傳檔案 $file 失敗\n";
}
 
ftp_close($conn_id);
fclose($fp);
?>

</head>
<body>



</body>
</html>

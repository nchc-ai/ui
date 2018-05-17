<?php
include "../session.php";
include "pclzip.php";
/**
 * 單一及多檔案上傳
 *
 * @author  smalljacky <small.jack.computer@gmail.com>
 * @version 1.0
 */

class Upload
{
    /**
     * 檢查上傳檔案是否為允許的類型
     *
     * @var array
     */
    private $allowMIME;

    /**
     * 允許上傳檔案的擴展名
     *
     * @var array
     */
    private $allowExt;

    /**
     * 上傳檔案容量大小限制
     *
     * @var int
     */
    private $maxSize;

    /**
     * 檢查是否為真實的圖片類型（只允許上傳圖片的話）
     *
     * @var boolean
     */
    private $flag;

    /**
     * 存放檔案的目錄
     *
     * @var string
     */
    private $uploadPath;

    /**
     * $_FILES 取得的 HTTP 檔案上傳項目
     *
     * @var array
     */
    private $fileInfo;

    /**
     * 上傳檔案訊息
     *
     * @var array
     */
    private $res;

    /**
     * 實際儲存檔名路徑
     *
     * @var array
     */
    private $uploadFiles;

    /**
     * 儲存擴展名
     *
     * @var string
     */
    private $ext;

    /**
     * 檔案限制設定
     *
     * @param  array $allowMIME
     * @param  array $allowExt
     * @param  int $maxSize
     * @param  boolean $flag
     * @param  string $uploadPath
     */
    public function __construct($uploadPath, array $allowMIME = array('application/octet-stream','application/x-tar','application/x-gzip','application/x-zip-compressed','application/zip','application/x-7z-compressed','application/gzip','application/x-rar'), array $allowExt = array('7z', 'tar', 'zip', 'tar.gz', 'gz', 'rar'), $maxSize = 53687091200, $flag = true)
#    public function __construct(array $allowMIME = array('application/octet-stream','application/x-tar','application/x-gzip','application/x-zip-compressed'), array $allowExt = array('7z', 'tar', 'zip', 'tar.gz', 'gz', 'rar'), $maxSize = 2097152, $flag = true, $uploadPath = '/tmp/newfolder')
    {
        $this->fileInfo = $this->getFiles();
        $this->allowMIME = $allowMIME;
        $this->allowExt = $allowExt;
        $this->maxSize = $maxSize;
        $this->flag = $flag;
        $this->uploadPath = $uploadPath;
    }

    /**
     * 將實際儲存檔名存入 array
     *
     * @return void
     */
    public function callUploadFile()
    {
	$mess=array();
	$error=0;
	$count=0;
        $res = '';
        foreach ($this->fileInfo as $file){
            $res = $this->uploadFile($file);
#            $this->showMessage();   // 顯示上傳訊息
	    if (empty($res['error'])){
		$mess[$count]=$res['succ'];
	    }
	    else {$mess[$count]=$res['error'];$error=1;}
            if (!empty($this->res['dest'])) {
                $this->uploadFiles[] = $res['dest'];
            }
            $this->res = array();  // 清除所有訊息
	    $count+=1;
        }
	$ret=array($error,$mess);
	return $ret;
    }

    /**
     * 取得實際儲存檔名路徑
     *
     * @return array
     */
    public function getDestination()
    {
        if (!empty($this->uploadFiles)) {
            print_r($this->uploadFiles);
        }
    }

    /**
     * 判斷上傳單一或多個檔案，並重新建構上傳檔案的 array
     * 
     * @return array
     */
    protected function getFiles()
    {
        $i = 0;  // 遞增 array 數量

        foreach ($_FILES as $file) {
            // string 型態，表示上傳單一檔案
            if (is_string($file['name'])) {
                $files[$i] = $file;
                $i++;
            } elseif (is_array($file['name'])) {    // array 型態，表示上傳多個檔案
                foreach ($file['name'] as $key => $value) {
                    $files[$i]['name'] = $file['name'][$key];
                    $files[$i]['type'] = $file['type'][$key];
                    $files[$i]['tmp_name'] = $file['tmp_name'][$key];
                    $files[$i]['error'] = $file['error'][$key];
                    $files[$i]['size'] = $file['size'][$key];
                    $i++;
                }
            }
            return $files;
        }
    }

    /**
     * 單一及多檔案上傳，並回傳存放目錄 + md5 產生的檔案名稱 + 擴展名
     *
     * @return array
     */
    private function uploadFile($file)
    {
        $uniName = '';
        $destination = '';

        if ($this->checkError($file) && $this->checkHttpPost($file) && $this->checkMIME($file) && $this->checkExt($file) && $this->checkSize($file) && $this->checkTrueImg($file)) {
            $this->checkUploadPath();
            $uniName = $this->getUniName();
#	    $foldername = $this->foldername;
#	    $conn = $this->conn;
            $destination = $this->uploadPath . '/' .$file['name'] ;
            
            if (!@move_uploaded_file($file['tmp_name'], $destination)) {
                $this->res['error'] = $file['name'] . '檔案移動失敗';
            } else {
                $this->res['succ'] = $file['name'] . '上傳成功';
                $this->res['dest'] = $destination;
		
		//insert to database
#		$sqlinsert= "INSERT INTO `data_upload`(`name`, `userid`) VALUES ('".$foldername."','".$_SESSION['aid']."')";
#		mysqli_query($conn,$sqlinsert);

		//解壓縮
		$directpath=$this->uploadPath.'/';
		$upzipfile=new PclZip($directpath.$file['name']);
		$upzipfile->extract(PCLZIP_OPT_PATH,$directpath);
		
		//轉址
#		echo "<script>alert('上傳成功');";
#		echo "window.location=('course_create.php');";
#		echo "</script>";

            }
        }
        return $this->res;
    }

    /**
     * 檢查上傳檔案是否有錯誤
     *
     * @param  array $files 透過 $_FILES 取得的 HTTP 檔案上傳的項目 array
     * @return boolean
     */
    protected function checkError($file)
    {
        if ($file['error'] > 0) {
            switch ($file['error']) {
                case 1:
                    $this->res['error'] = $file['name'] . ' 上傳的檔案超過了 php.ini 中 upload_max_filesize 允許上傳檔案容量的最大值';
                    break;
                case 2:
                    $this->res['error'] = $file['name'] . ' 上傳檔案的大小超過了 HTML 表單中 MAX_FILE_SIZE 選項指定的值';
                    break;
                case 3:
                    $this->res['error'] = $file['name'] . ' 檔案只有部分被上傳';
                    break;
                case 4:
                    $this->res['error'] = $file['name'] . ' 沒有檔案被上傳（沒有選擇上傳檔案就送出表單）';
                    break;
                case 6:
                    $this->res['error'] = $file['name'] . ' 找不到臨時目錄';
                    break;
                case 7:
                    $this->res['error'] = $file['name'] . ' 檔案寫入失敗';
                    break;
                case 8:
                    $this->res['error'] = $file['name'] . ' 上傳的文件被 PHP 擴展程式中斷';
                    break;
            }
            return false;
        }
        return true;
    }

    /**
     * 檢查檔案是否是通過 HTTP POST 上傳的
     *
     * @param  array $files 透過 $_FILES 取得的 HTTP 檔案上傳的項目 array
     * @return boolean
     */
    private function checkHttpPost($file)
    {
        if (!is_uploaded_file($file['tmp_name'])) {
            $this->res['error'] = $file['name'] . '檔案不是通過 HTTP POST 方式上傳的';
            return false;
        }
        return true;
    }

    /**
     * 檢查上傳檔案是否為允許的類型
     *
     * @param  array $files 透過 $_FILES 取得的 HTTP 檔案上傳的項目 array
     * @return boolean
     */
    private function checkMIME($file)
    {
        if (!in_array($file['type'], $this->allowMIME)) {
            $this->res['error'] = '"'.$file['name'] .'"不是允許的檔案類型';
            return false;
        }
        return true;
    }

    /**
     * 檢查上傳檔案是否為允許的擴展名
     *
     * @param  array $files 透過 $_FILES 取得的 HTTP 檔案上傳的項目 array
     * @return boolean
     */
    private function checkExt($file)
    {
        $this->ext = pathinfo($file['name'], PATHINFO_EXTENSION);  // 取得上傳檔案的擴展名

        // 檢查上傳檔案是否為允許的擴展名、及參數是否為陣列
        if (!is_array($this->allowExt)) {  
            $this->res['error'] = $file['name'] . ' 檔案類型型態必須為 array';
            return false;
        } else {
            // 檢查陣列中是否有允許的擴展名
            if (!in_array($this->ext, $this->allowExt)) {
                $this->res['error'] = $file['name'] . ' 非法檔案類型';
                return false;
            }
        }
        return true;
    }

    /**
     * 檢查上傳檔案的容量大小是否符合規範
     *
     * @param  array $files 透過 $_FILES 取得的 HTTP 檔案上傳的項目 array
     * @return boolean
     */
    private function checkSize($file)
    {
        if ($file['size'] > $this->maxSize) {
            $this->res['error'] = $file['name'] . '上傳檔案容量超過限制';
            return false;
        }
        return true;
    }

    /**
     * 檢查是否為真實的圖片類型
     *
     * @param  array $files 透過 $_FILES 取得的 HTTP 檔案上傳的項目 array
     * @return boolean
     */	     
    private function checkTrueImg(array $file)
    {
        if ($this->flag) {
            if (!@getimagesize($file['tmp_name'])) {
//                $this->res['error'] = $file['name'] . '不是真正的圖片類型';
                return true;
            }
            return true;
        }
    }


    /**
     * 檢查指定目錄是否存在，不存在就建立目錄
     *
     * @return void
     */
    private function checkUploadPath()
    {
        if (!file_exists($this->uploadPath)) {
            mkdir($this->uploadPath, 0777, true);
        }
    }

    /**
     * 產生唯一的檔案名稱
     *
     * @return string
     */
    private function getUniName()
    {
        return md5(uniqid(microtime(true), true));
    }

    /**
     * 顯示上傳訊息
     *
     * @return void
     */
    private function showMessage()
    {
        if (!empty($this->res['error'])) {
            echo '<span style="color: #ff0000;">' . $this->res['error'] . '</span><br>';
        } else {
            echo '<span style="color: #0000ff;">' . $this->res['succ'] . '</span><br>';
        }
    }
}


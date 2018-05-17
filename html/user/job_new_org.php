<?php
include "../session.php";
include "includejs.php";
// DB Connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//if ( $_POST['gateway_id']!='' && $_POST['gateway_password']!='' ){
if ( isset($_POST['DDL_di_id']) && $_POST['gateway_id']!='' && $_POST['gateway_password']!='' ){
    $Hardware = 1;
    $sqlselect = "select * from `job` where 1;";
    $resultselect = mysqli_query($conn, $sqlselect);
    while ($rowselect = mysqli_fetch_assoc($resultselect)) {
        $portlist[]=$rowselect['gateway_port'];    
    }
    $emptyport=50000;
    for ($i=50000;$i<60000;$i++){
        if ( ! in_array($i,$portlist)){
            $emptyport = $i;
            break;
        }
    }
    $post_di_id_array=explode(":",$_POST['DDL_di_id']);
    $post_docker_image_name=$post_di_id_array[0];
    $post_docker_image_tag=$post_di_id_array[1];
    $post_mode=$post_di_id_array[2];
    $post_docker_image_id=$post_di_id_array[3];
    $sqldockerimg = "select * from `docker_image` where `di_id`='".$post_docker_image_id."';";
    $resultdockerimg = mysqli_query($conn, $sqldockerimg);
    $rowdockerimg = mysqli_fetch_assoc($resultdockerimg);

    $sqlinsert= "insert into `job` ( `hardware`,`di_id`,`status`,`dt_create`,`gateway_id`,`gateway_password`,`gateway_port`,`source_ip_address`,`aid`,`id`, `docker_server`, `mode`, `cmd`, `course_id`, `dataset`) values('".$Hardware."','".$post_docker_image_name.":".$post_docker_image_tag."','start','".date("Y-m-d H:i:s")."','".$_POST['gateway_id']."','".$_POST['gateway_password']."','".$emptyport."','".$_POST['div_source_ip_address']."','".$_SESSION['aid']."','".$_SESSION['id']."','".$_POST['docker_server']."','".$post_mode."','".$rowdockerimg['cmd']."','".$_POST['course_id']."','".$_POST['dataset_course']."')";
    mysqli_query($conn,$sqlinsert);
   
    #$sql="select job.hardware,job.gateway_id,job.gateway_password,job.gateway_port,job.source_ip_address,user.id,docker_image.name,docker_image.tag,docker_image.digits,docker_image.tensorboard from job inner join user on job.id=user.id inner join docker_image on job.di_id=docker_image.di_id where job_id='" . $_GET['job_id'] . "'";
    $sql="SELECT * FROM `job` WHERE `aid`='".$_SESSION['aid']."' ORDER BY `job_id` DESC LIMIT 1";
    $result=$conn->query($sql);
    $row=$result->fetch_assoc();
    
    //套餐 => GPU 數量
    if ($row["hardware"]=="1"){
    	$number_of_gpu=1;
    } elseif ($row["hardware"]=="2"){
    	$number_of_gpu=2;
    } elseif ($row["hardware"]=="3"){
    	$number_of_gpu=4;
    } elseif ($row["hardware"]=="4"){
    	$number_of_gpu=8;
    }
    
    $gateway_id=$row["gateway_id"];
    $gateway_password=$row["gateway_password"];
    $gateway_port=$row["gateway_port"];
    if ($row["source_ip_address"]==""){
    	$source_ip_address="all";
    } else {
    	$source_ip_address=$row["source_ip_address"];
    }
    
    $id=$row["id"];  //使用者帳號 user id
    
    $di_id_array=explode(":",$row["di_id"]);
    $docker_image_name=$di_id_array[0];
    $docker_image_tag=$di_id_array[1];

    $mode=$row["mode"];
    
    $iam_id=str_replace("@",".", $id);
    
    $sqlgpu="select * from job_gpu inner join gpu on job_gpu.gpu_id=gpu.gpu_id where job_gpu.job_id='" . $row['job_id'] . "'";
    $resultgpu=$conn->query($sqlgpu);
    
    $i=0;
    $gpus=array();
    while($rowgpu = $resultgpu->fetch_assoc()) {
    	$i=$i+1;
    	if ($i==1){
    		$server=$rowgpu["server"];
    		$gpu_id=$rowgpu["gpu_id"];
    	}
    	$gpus[]=$rowgpu["gpu"];
    }
    mysqli_close($conn);
    
   # $port=$gpu_id;
   # while($port > 8) {
   #     $port=$port-8;
   # }
    #debug
    $StartPort = ( $row['job_id'] % 1000 );
    $Port5000 = $StartPort + 5000;
    $Port6000 = $StartPort + 6000;
    $Port8000 = $StartPort + 8000;
    $port=9; 
    $server=$row['docker_server'];

    // 1. Create Working Dir
    $url = "http://".$server."/mk_home.php?u_name=".$iam_id;
    $urlresult=file_get_contents($url);
    echo $urlresult."<hr>";  
 
    // 2. Create Container
    If ($number_of_gpu==1){
    	$jsonData=array(
    		'Hostname'=>$id,
    		'Image'=>$docker_image_name . ":" . $docker_image_tag,
    		//'Tty'=>true,
    		'HostConfig'=>array(
    			'Binds'=>['/storage/' . $iam_id . ':/workspace','nvidia_driver_390.25:/usr/local/nvidia:ro'],
    			'Memory'=>12884901888*$number_of_gpu,
    			'NanoCPUs'=>4000000000*$number_of_gpu,
    			'PortBindings'=>array(
    				'5000/tcp'=>[array('HostPort'=> (string)$Port5000)],
    				'8888/tcp'=>[array('HostPort'=> (string)$Port8000)],
    				'6006/tcp'=>[array('HostPort'=> (string)$Port6000)]
    			),
    			'PublishAllPorts'=>false,
    			'Privileged'=>false,
    			'ReadonlyRootfs'=>false,
    			'Dns'=>['168.95.1.1'],
    			'Devices'=>[
    				array(
    					'PathOnHost'=>'/dev/nvidiactl',
    					'PathInContainer'=>'/dev/nvidiactl',
    					'CgroupPermissions'=>'rwm'
    				),
    				array(
    					'PathOnHost'=>'/dev/nvidia-uvm',
    					'PathInContainer'=>'/dev/nvidia-uvm',
    					'CgroupPermissions'=>'rwm'
    				),
    				array(
    					'PathOnHost'=>'/dev/nvidia-uvm-tools',
    					'PathInContainer'=>'/dev/nvidia-uvm-tools',
    					'CgroupPermissions'=>'rwm'
    				)
#    				array(
#    					'PathOnHost'=>$gpus[0],
#    					'PathInContainer'=>$gpus[0],
#    					'CgroupPermissions'=>'rwm'
#    				)
    			]
    		)
    	);	
    } elseif ($number_of_gpu==2){
    	$jsonData=array(
    		'Hostname'=>$id,
    		'Image'=>$docker_image_name . ":" . $docker_image_tag,
    		'Tty'=>true,
    		'HostConfig'=>array(
    			'Binds'=>['/storage/' . $iam_id . ':/workspace','nvidia_driver_390.25:/usr/local/nvidia:ro'],
    			'Memory'=>12884901888*$number_of_gpu,
    			'NanoCPUs'=>4000000000*$number_of_gpu,
    			'PortBindings'=>array(
                                '5000/tcp'=>[array('HostPort'=> (string)$Port5000)],
                                '8888/tcp'=>[array('HostPort'=> (string)$Port8000)],
                                '6006/tcp'=>[array('HostPort'=> (string)$Port6000)]
    			),
    			'PublishAllPorts'=>false,
    			'Privileged'=>false,
    			'ReadonlyRootfs'=>false,
    			'Dns'=>['168.95.1.1'],
    			'Devices'=>[
    				array(
    					'PathOnHost'=>'/dev/nvidiactl',
    					'PathInContainer'=>'/dev/nvidiactl',
    					'CgroupPermissions'=>'rwm'
    				),
    				array(
    					'PathOnHost'=>'/dev/nvidia-uvm',
    					'PathInContainer'=>'/dev/nvidia-uvm',
    					'CgroupPermissions'=>'rwm'
    				),
    				array(
    					'PathOnHost'=>'/dev/nvidia-uvm-tools',
    					'PathInContainer'=>'/dev/nvidia-uvm-tools',
    					'CgroupPermissions'=>'rwm'
    				)
#    				array(
#    					'PathOnHost'=>$gpus[0],
#    					'PathInContainer'=>$gpus[0],
#    					'CgroupPermissions'=>'rwm'
#    				),
#    				array(
#    					'PathOnHost'=>$gpus[1],
#    					'PathInContainer'=>$gpus[1],
#    					'CgroupPermissions'=>'rwm'
#    				)
    			]
    		)
    	);
    } elseif ($number_of_gpu==4){
    	$jsonData=array(
    		'Hostname'=>$id,
    		'Image'=>$docker_image_name . ":" . $docker_image_tag,
    		'Tty'=>true,
    		'HostConfig'=>array(
    			'Binds'=>['/storage/' . $iam_id . ':/workspace','nvidia_driver_390.25:/usr/local/nvidia:ro'],
    			'Memory'=>12884901888*$number_of_gpu,
    			'NanoCPUs'=>4000000000*$number_of_gpu,
    			'PortBindings'=>array(
                                '5000/tcp'=>[array('HostPort'=> (string)$Port5000)],
                                '8888/tcp'=>[array('HostPort'=> (string)$Port8000)],
                                '6006/tcp'=>[array('HostPort'=> (string)$Port6000)]
    			),
    			'PublishAllPorts'=>false,
    			'Privileged'=>false,
    			'ReadonlyRootfs'=>false,
    			'Dns'=>['168.95.1.1'],
    			'Devices'=>[
    				array(
    					'PathOnHost'=>'/dev/nvidiactl',
    					'PathInContainer'=>'/dev/nvidiactl',
    					'CgroupPermissions'=>'rwm'
    				),
    				array(
    					'PathOnHost'=>'/dev/nvidia-uvm',
    					'PathInContainer'=>'/dev/nvidia-uvm',
    					'CgroupPermissions'=>'rwm'
    				),
    				array(
    					'PathOnHost'=>'/dev/nvidia-uvm-tools',
    					'PathInContainer'=>'/dev/nvidia-uvm-tools',
    					'CgroupPermissions'=>'rwm'
    				)
#    				array(
#    					'PathOnHost'=>$gpus[0],
#    					'PathInContainer'=>$gpus[0],
#    					'CgroupPermissions'=>'rwm'
#    				),
#    				array(
#    					'PathOnHost'=>$gpus[1],
#    					'PathInContainer'=>$gpus[1],
#    					'CgroupPermissions'=>'rwm'
#    				),
#    				array(
#    					'PathOnHost'=>$gpus[2],
#    					'PathInContainer'=>$gpus[2],
#    					'CgroupPermissions'=>'rwm'
#    				),
#    				array(
#    					'PathOnHost'=>$gpus[3],
#    					'PathInContainer'=>$gpus[3],
#    					'CgroupPermissions'=>'rwm'
#    				)
    			]
    		)
    	);	
    } else {
    	$jsonData=array(
    		'Hostname'=>$id,
    		'Image'=>$docker_image_name . ":" . $docker_image_tag,
    		'Tty'=>true,
    		'HostConfig'=>array(
    			'Binds'=>['/storage/' . $iam_id . ':/workspace','nvidia_driver_390.25:/usr/local/nvidia:ro'],
    			'Memory'=>12884901888*$number_of_gpu,
    			'NanoCPUs'=>4000000000*$number_of_gpu,
    			'PortBindings'=>array(
                                '5000/tcp'=>[array('HostPort'=> (string)$Port5000)],
                                '8888/tcp'=>[array('HostPort'=> (string)$Port8000)],
                                '6006/tcp'=>[array('HostPort'=> (string)$Port6000)]
    			),
    			'PublishAllPorts'=>false,
    			'Privileged'=>false,
    			'ReadonlyRootfs'=>false,
    			'Dns'=>['168.95.1.1'],
    			'Devices'=>[
    				array(
    					'PathOnHost'=>'/dev/nvidiactl',
    					'PathInContainer'=>'/dev/nvidiactl',
    					'CgroupPermissions'=>'rwm'
    				),
    				array(
    					'PathOnHost'=>'/dev/nvidia-uvm',
    					'PathInContainer'=>'/dev/nvidia-uvm',
    					'CgroupPermissions'=>'rwm'
    				),
    				array(
    					'PathOnHost'=>'/dev/nvidia-uvm-tools',
    					'PathInContainer'=>'/dev/nvidia-uvm-tools',
    					'CgroupPermissions'=>'rwm'
    				)
#    				array(
#    					'PathOnHost'=>$gpus[0],
#    					'PathInContainer'=>$gpus[0],
#    					'CgroupPermissions'=>'rwm'
#    				),
#    				array(
#    					'PathOnHost'=>$gpus[1],
#    					'PathInContainer'=>$gpus[1],
#    					'CgroupPermissions'=>'rwm'
#    				),
#    				array(
#    					'PathOnHost'=>$gpus[2],
#    					'PathInContainer'=>$gpus[2],
#    					'CgroupPermissions'=>'rwm'
#    				),
#    				array(
#    					'PathOnHost'=>$gpus[3],
#    					'PathInContainer'=>$gpus[3],
#    					'CgroupPermissions'=>'rwm'
#    				),
#    				array(
#    					'PathOnHost'=>$gpus[4],
#    					'PathInContainer'=>$gpus[4],
#    					'CgroupPermissions'=>'rwm'
#    				),
#    				array(
#    					'PathOnHost'=>$gpus[5],
#    					'PathInContainer'=>$gpus[5],
#    					'CgroupPermissions'=>'rwm'
#    				),
#    				array(
#    					'PathOnHost'=>$gpus[6],
#    					'PathInContainer'=>$gpus[6],
#    					'CgroupPermissions'=>'rwm'
#    				),
#    				array(
#    					'PathOnHost'=>$gpus[7],
#    					'PathInContainer'=>$gpus[7],
#    					'CgroupPermissions'=>'rwm'
#    				)
    			]
    		)
    	);
    }
    if ( $rowdockerimg['cmd'] != "" &&  $rowdockerimg['cmd'] != NULL ){
        $jsonData['Cmd']=[$rowdockerimg['cmd']];
    }
    $data=json_encode($jsonData,JSON_PRETTY_PRINT);
    
    $url='http://' . $server . ':2375/containers/create?name=' . $row['job_id'];
    $ch=curl_init($url);
    curl_setopt($ch,CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch,CURLOPT_POSTFIELDS, "$data");
    curl_setopt($ch,CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    $result=curl_exec($ch);
    echo $data;
    echo $url."<hr/>";
    echo $result . "<hr/>";
    
    // 3. Start Container
    $url='http://' . $server . ':2375/containers/' . $row['job_id'] . '/start';
    $ch=curl_init($url);
    curl_setopt($ch,CURLOPT_CUSTOMREQUEST,"POST");
    $result=curl_exec($ch);
    echo $result . "<hr/>";
    
//                                '5000/tcp'=>[array('HostPort'=>$port5000)],
 //                               '8888/tcp'=>[array('HostPort'=>$port8000)],
  //                              '6006/tcp'=>[array('HostPort'=>$port6000)]
    
    // 4. Auth 
    $url='http://'.$_SESSION['gatewayip'].'/create_config.php';
    if ($mode=="1"){
    	$jsonData=array(
    		'apache-port'=>$gateway_port,
    		'container-name'=>$row['job_id'],
    		'dgx1-port'=>$Port5000,
    		'dgx1-domain-name'=>$server,
    		'service-type'=>'digits',
    		'account'=>$gateway_id,
    		'password'=>$gateway_password,
    		'user-source-ip'=>$source_ip_address
    	);
    	$data=json_encode($jsonData);
    	$ch=curl_init($url);
    	curl_setopt($ch,CURLOPT_CUSTOMREQUEST, "POST");
    	curl_setopt($ch,CURLOPT_POSTFIELDS, $data);
    	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
    	curl_setopt($ch,CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    	$result=curl_exec($ch);
        #var_dump($jsonData);
    	echo $result . "6<hr/>";
    }
    
    if ($mode=="2"){
    	$jsonData=array(
    		'apache-port'=>$gateway_port,
    		'container-name'=>$row['job_id'],
    		'dgx1-port'=>$Port8000,
    		'dgx1-domain-name'=>$server,
    		'service-type'=>'jupyter',
    		'account'=>$gateway_id,
    		'password'=>$gateway_password,
    		'user-source-ip'=>$source_ip_address
    	);
    	$data=json_encode($jsonData);
    	$ch=curl_init($url);
    	curl_setopt($ch,CURLOPT_CUSTOMREQUEST, "POST");
    	curl_setopt($ch,CURLOPT_POSTFIELDS, $data);
    	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
    	curl_setopt($ch,CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    	$result=curl_exec($ch);
    	echo $result . "8<hr/>";
    	
    	$jsonData=array(
    		'apache-port'=>$gateway_port+1,
    		'container-name'=>$row['job_id'],
    		'dgx1-port'=>$Port6000,
    		'dgx1-domain-name'=>$server,
    		'service-type'=>'tensorboard',
    		'account'=>$gateway_id,
    		'password'=>$gateway_password,
    		'user-source-ip'=>$source_ip_address
    	);
    	$data=json_encode($jsonData);
    	$ch=curl_init($url);
    	curl_setopt($ch,CURLOPT_CUSTOMREQUEST, "POST");
    	curl_setopt($ch,CURLOPT_POSTFIELDS, $data);
    	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
    	curl_setopt($ch,CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    	$result=curl_exec($ch);
    	echo $result . "7<hr/>";
    }
    
    if ($mode == '0'){
    	$jsonData=array(
    		'apache-port'=>$gateway_port,
    		'container-name'=>$row['job_id'],
    		'dgx1-port'=>$Port8000,
    		'dgx1-domain-name'=>$server,
    		'service-type'=>'jupyter',
    		'account'=>$gateway_id,
    		'password'=>$gateway_password,
    		'user-source-ip'=>$source_ip_address
    	);
    	$data=json_encode($jsonData);
    	$ch=curl_init($url);
    	curl_setopt($ch,CURLOPT_CUSTOMREQUEST, "POST");
    	curl_setopt($ch,CURLOPT_POSTFIELDS, $data);
    	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
    	curl_setopt($ch,CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    	$result=curl_exec($ch);
    	echo $result . "9<hr/>";
    }
header("Location:job.php");
exit;
}
else{
echo "<script>alert('請輸入帳號/密碼'); location.href = 'course.php';</script>";
}
//header("Location:job.php");
//exit;
?>

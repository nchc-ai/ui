<?php
include "../session.php";
include "docker_restful.php";

$server=$_GET['server'];
$id=$_GET['id'];
#$port=$id+'10000';
$mode=$_GET['mode'];

$exid=docker_exec($server,$id,$mode);
docker_exec_start($server,$exid);
if ($mode==3){
$port=$id+'8000';
}else{
$port=$id+'10000';
}
header("Location:http://".$server.":".$port);

#exit;

?>

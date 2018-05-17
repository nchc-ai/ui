<?php
function docker_exec($id){
    $url = "http://localhost/containers/".$id."/exec";
    $ch=curl_init();
    curl_setopt($ch,CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    if( ! $result = curl_exec($ch)){
        trigger_error(curl_error($ch));
    }
    curl_close($ch);
    return json_decode($result);
}
function ifckandata($dataname){

    $url = curl_init();
    $url = "http://aidm.nchc.org.tw/api/3/action/group_show?id=ai&include_datasets=True";
    $data = file_get_contents($url);
    $output =  json_decode($data);
    $package_count = $output->{'result'}->{'package_count'};
    $packages = $output->{'result'}->{'packages'};
	for ($i=0;$i<$package_count;$i++){
		$name = $packages[$i]->{'name'};
		if ($dataname==$name){return 1;exit;}
	}
	return 0;
}

function ckan_api_checked($dataset_choose){

    $url = curl_init();
    $url = "http://aidm.nchc.org.tw/api/3/action/group_show?id=ai&include_datasets=True";
    $data = file_get_contents($url);
    $output =  json_decode($data);
    $package_count = $output->{'result'}->{'package_count'};
    $packages = $output->{'result'}->{'packages'};
    $dataset_num=count($dataset_choose);
    $data_count = 0;
    $used = 0;
    for ($i=0;$i<$package_count;$i++){
        $name = $packages[$i]->{'name'};
	$checked=0;
        if ($name != "imagenet-ilsvrc2012"){
		for ($j=0;$j<$dataset_num;$j++){
			if ($name == $dataset_choose[$j]){
	echo '<tr><td><input type="checkbox" name="DSet'.$data_count.'" id="DSet'.$data_count.'" value="'.$name.'" checked><label>'.$name.'</label</td></tr>'."\n";
	$checked=1;
	$used+=1;}
		}
	if ($checked!=1){
	echo '<tr><td><input type="checkbox" name="DSet'.$data_count.'" id="DSet'.$data_count.'" value="'.$name.'"><label>'.$name.'</label</td></tr>'."\n";}
        $data_count+=1;
        }
    }
    return $array=array($data_count,$used);
}

function ckan_api(){

    $url = curl_init();
    $url = "http://aidm.nchc.org.tw/api/3/action/group_show?id=ai&include_datasets=True";
    $data = file_get_contents($url);
    $output =  json_decode($data);
    $package_count = $output->{'result'}->{'package_count'};
    $packages = $output->{'result'}->{'packages'};
    $data_count = 0;
    for ($i=0;$i<$package_count;$i++){
        $name = $packages[$i]->{'name'};
        if ($name != "imagenet-ilsvrc2012"){
        echo '<tr><td><input type="checkbox" name="DSet'.$data_count.'" id="DSet'.$data_count.'" value="'.$name.'"><label>'.$name.'</label</td></tr>'."\n";
        $data_count+=1;
        }
    }
    return $data_count;
}

function docker_ps($server){

    $url="http://".$server.":2375/containers/json";
    $ch=curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    if( ! $result = curl_exec($ch)){ 
        trigger_error(curl_error($ch)); 
    } 
    curl_close($ch);
    return json_decode($result);
}

function docker_ps_id($server,$id){

    $url="http://".$server.":2375/containers/".$id."/json";
    $ch=curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    if( ! $result = curl_exec($ch)){
        trigger_error(curl_error($ch));
    }
    curl_close($ch);
    return json_decode($result);
}

function docker_images($server){

    $url="http://".$server.":2375/images/json";
    $ch=curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    if( ! $result = curl_exec($ch)){
        trigger_error(curl_error($ch));
    }
    curl_close($ch);
    return json_decode($result);
}

function docker_commit($server,$containerid,$repo,$tag){ 
    $url="http://".$server.":2375/commit?container=".$containerid."&repo=".$repo."&tag=".$tag;
    $ch=curl_init();
    curl_setopt($ch,CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    if( ! $result = curl_exec($ch)){
        trigger_error(curl_error($ch));
    }
    curl_close($ch);
    return json_decode($result);
}

$server="127.0.0.1";
#$containerid="0b197eedba74";
#$repo="tensorflow";
#$tag="v6";
#$containerlist=docker_ps($server);
#$containerlist=docker_images($server);
#$containerlist=docker_commit($server,$containerid,$repo,$tag);
#$jsonstr=file_get_contents("json.txt");
#var_dump($containerlist);
$id="0b197eedba74";

#var_dump(docker_ps_id($server,$id));
?>

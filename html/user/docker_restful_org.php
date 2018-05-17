<?php

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

    $url="http://".$server.":2375/containers/images";
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

var_dump(docker_ps_id($server,$id));
?>

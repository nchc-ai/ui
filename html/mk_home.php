<?PHP
$u_name = "";

if( !empty($_GET["u_name"]) ){
	#echo $_GET["u_name"] .",". $_GET["u_ip"];	
	$output = shell_exec("sh scripts/mk_home.sh " . $_GET["u_name"]  );
	#$output = shell_exec("ls -althr");
	echo $output;
}else{
	echo "error";
}
?>

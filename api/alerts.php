<?php
// alerts for holdings. uses local csv file as storage. 
// file layout header: id,symbol,trigger,condition,target,notes

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$filePath = '../data/alerts.csv';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	// Takes raw data from the request
	$json = file_get_contents('php://input');
	// Converts it into a PHP object
	$data = json_decode($json);
	$type = $data->type;
	$id = $data->id;
	
	if ($type == "add" || $type == "update") {
		$symbol = $data->symbol;
		$trigger = $data->trigger;
		$condition = $data->condition;
		$target = $data->target;
		$notes = $data->notes;
	}
	
	$csv = array();
	$file = fopen($filePath, 'r');
	$found = false;
	
	while (($result = fgetcsv($file)) !== false)
	{
		if ($result[0] == $id) { 
			$found = true;
		} else {
			$csv[] = $result;
		}
	}
	
	if ($type == "add" || $type == "update") {
		$csv[] = array($id, $symbol, $trigger, $condition, $target, $notes);
	}
	
	fclose($file);

	$file = fopen($filePath, 'w');
	if (flock($file, LOCK_EX)) {
		foreach ($csv as $line) {
			fputcsv($file, $line, ',');
		}
		flock($file, LOCK_UN);
		fclose($file);
		echo json_encode(array("message" => "success", "data" => $data));
	} else {
		echo json_encode(array("message" => "lock error", "data" => $data));
	}
} 

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	// GET alerts 
	$csv = array();
	$response = array();
	$file = fopen($filePath, 'r');

	while (($result = fgetcsv($file)) !== false)
	{
		$csv[] = $result;
	}

	fclose($file);

	//alert template
	$alertTempate = '{"id":"id","symbol":"symbol","trigger":"trigger","condition":"condition","target":"target","notes":"notes"}';
	$alertTempArray = json_decode($alertTempate,true);

	// add alerts
	for ($i = 1; $i < count($csv); $i++) {
		$newAlert = $alertTempArray;
		$newAlert['id'] = $csv[$i]['0'];
		$newAlert['symbol'] = $csv[$i]['1'];
		$newAlert['trigger'] = $csv[$i]['2'];
		$newAlert['condition'] = $csv[$i]['3'];
		$newAlert['target'] = $csv[$i]['4'];
		$newAlert['notes'] = $csv[$i]['5'];
		$response[] = $newAlert;
	}

	echo json_encode($response);  
}

?>
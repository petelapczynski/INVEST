<?php
// comments for holdings. uses local csv file as storage. 
// file layout header: symbol,comment

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$filePath = '../data/comments.csv';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
//if( $_GET["symbol"] && $_GET["comment"] ) {
	// Takes raw data from the request
	$json = file_get_contents('php://input');
	// Converts it into a PHP object
	$data = json_decode($json);
	
	$symbol = $data->symbol;
	$comment = $data->comment;

	$csv = array();
	$file = fopen($filePath, 'r');
	$found = false;
	
	while (($result = fgetcsv($file)) !== false)
	{
		if ($result[0] == $symbol) { 
			$found = true;
			$csv[] = array($symbol, $comment);
		} else {
			$csv[] = $result;
		}
		
	}
	
	if (!$found) {
		$csv[] = array($symbol, $comment);
	}
	
	fclose($file);

	$file = fopen($filePath, 'w');
	foreach ($csv as $line) {
		fputcsv($file, $line, ',');
	}
	fclose($file);
	echo json_encode(array("message" => "success", "data" => $data));
} 

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	// GET Comments 
	$csv = array();
	$response = array();
	$file = fopen($filePath, 'r');

	while (($result = fgetcsv($file)) !== false)
	{
		$csv[] = $result;
	}

	fclose($file);

	//comment template
	$commentTempate = '{"symbol":"symbol","comment":"comment"}';
	$commentTempArray = json_decode($commentTempate,true);

	// add comments
	for ($i = 1; $i < count($csv); $i++) {
		$newComment = $commentTempArray;
		$newComment['symbol'] = $csv[$i]['0'];
		$newComment['comment'] = $csv[$i]['1'];
		$response[] = $newComment;
	}

	echo json_encode($response);  
}

?>
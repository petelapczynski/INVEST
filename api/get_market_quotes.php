<?php
// Ally Invest call for for market quote data, return array of quote data

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include key and curl request file
include_once 'api_keys.php';
include_once 'curl_http_request.php';

// get data from request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	$params = $_GET;
	$contentType = "application/json";
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$params = file_get_contents('php://input');
	$contentType = "application/text";
}

$url = "https://devapi.invest.ally.com/v1/market/ext/quotes.json";
$get_data = curl_http_request($_SERVER['REQUEST_METHOD'], $url, $params, $OAuthHeader, $contentType);
$response = json_decode($get_data, true);
$errors = $response['response']['error'];
	
if ($response && $errors == "Success") {
	// set response code - 200 ok
    http_response_code(200);
	$data = $response['response']['quotes']['quote'];
    echo json_encode($data);
} else {
	// set response code - 503 service unavailable
    http_response_code(503);
	//echo json_encode(array("message" => "Unable to get quote data."));
	echo json_encode(array("message" => $response));
}
?>
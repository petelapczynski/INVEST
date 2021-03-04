<?php
// Ally Invest call for Market Clock data

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
include_once 'curl_http_request.php';
  
$url = "https://devapi.invest.ally.com/v1/market/clock.json";

$get_data = curl_http_request('GET', $url, false, false);
$response = json_decode($get_data, true);
$errors = $response['response']['error'];
	
if ($response && $errors == "Success") {
	// set response code - 200 ok
    http_response_code(200);
	$data = $response['response'];
	//var_dump($data);
    echo json_encode($data);
} else {
	// set response code - 503 service unavailable
    http_response_code(503);
	//echo json_encode(array("message" => "Unable to get clock data."));
	echo json_encode(array("message" => $response));
}
?>
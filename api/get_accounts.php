<?php
// Ally Invest call for for account summary data, return account summary data only

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include key and curl request file
include_once 'api_keys.php';
include_once 'curl_http_request.php';
include 'get_extra_accounts_.php';
 
$url = "https://devapi.invest.ally.com/v1/accounts.json";

$get_data = curl_http_request('GET', $url, false, $OAuthHeader);
$response = json_decode($get_data, true);
$errors = $response['response']['error'];
	
if ($response && $errors == "Success") {
	// set response code - 200 ok
    http_response_code(200);
	$data = $response['response']['accounts']['accountsummary'];
	echo json_encode($data);
} else {
	// set response code - 503 service unavailable
    http_response_code(503);
	//echo json_encode(array("message" => "Unable to get account data."));
	echo json_encode(array("message" => $response));
	
}
?>
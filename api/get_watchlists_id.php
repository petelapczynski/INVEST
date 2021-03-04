<?php
// Ally Invest call to get Watch lists

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include key and curl request file
include_once 'api_keys.php';
include_once 'curl_http_request.php';
  
// get data from request
$params = $_GET['id'];
$url = "https://devapi.invest.ally.com/v1/watchlists/" . $params . ".json";

$get_data = curl_http_request('GET', $url, false, $OAuthHeader);
$response = json_decode($get_data, true);

if ($response) {
	// set response code - 200 ok
    http_response_code(200);
	$data = $response['response']['watchlists']['watchlist']['watchlistitem'];
	//var_dump($data);
    echo json_encode($data);
} else {
	// set response code - 503 service unavailable
    http_response_code(503);
	echo json_encode(array("message" => "Unable to get watchlist data."));
}
?>
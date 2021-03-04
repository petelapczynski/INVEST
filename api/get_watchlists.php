<?php
// Ally Invest call to get Watch lists and return items

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include key and curl request file
include_once 'api_keys.php';
include_once 'curl_http_request.php';
  
$url = "https://devapi.invest.ally.com/v1/watchlists.json";
$get_data = curl_http_request('GET', $url, false, $OAuthHeader);
$response = json_decode($get_data, true);

$watchListItems = [];
$data = $response['response']['watchlists']['watchlist'];
foreach ($data as $watchList) {
	$url = "https://devapi.invest.ally.com/v1/watchlists/" . $watchList['id'] . ".json";
	$get_data = curl_http_request('GET', $url, false, $OAuthHeader);
	$response = json_decode($get_data, true);
	if ($response) {
		$item = [];
		$item['id'] = $watchList['id'];
		$item['items'] = $response['response']['watchlists']['watchlist']['watchlistitem'];
		array_push($watchListItems, $item);
	}
}
	
if ($watchListItems) {
	// set response code - 200 ok
    http_response_code(200);
    echo json_encode($watchListItems);
} else {
	// set response code - 503 service unavailable
    http_response_code(503);
	echo json_encode(array("message" => "Unable to get watchlist data."));
}

?>
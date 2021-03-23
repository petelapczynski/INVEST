<?php
// Ally Invest call for for account history data
// request needs following parameters: acct, range, transactions 
// return array object containing [{"account":"acct#","transactions":[{transaction},...]}, ...]

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
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	$params = $_GET;
	//var_dump($params);
	// Account - 1 account per request to Ally API
	$accounts = $params['acct'];
	$accounts = explode(',',$accounts);
	//Range = all, today, current_week, current_month, last_month
	$range = $params['range'];
	if ($range == null || $range == "") {
		$range = "current_month"; 
	}
	// Transactions = all, bookkeeping, trade
	$transactions = $params['transactions'];
	if ($transactions == null || $transactions == "") {
		$transactions = "all"; 
	}
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$params = file_get_contents('php://input');
	//var_dump($params);
	// Account - 1 account per request to Ally API
	$accounts = $params['acct'];
	//Range = all, today, current_week, current_month, last_month
	$range = $params['range'];
	// Transactions = all, bookkeeping, trade
	$transactions = $params['transactions'];
}
 
$accountHistory = [];
foreach ($accounts as $account) {
	$url = "https://devapi.invest.ally.com/v1/accounts/" . $account . "/history.json?range=" . $range . "&transactions=" . $transactions;
	$get_data = curl_http_request('GET', $url, false, $OAuthHeader);
	$response = json_decode($get_data, true);

	if ($response && response['response']['error']) {
		$item = [];
		$item['account'] = $account;
		
		if ($response['response']['transactions']['transaction']) {
			$item['transactions'] = $response['response']['transactions']['transaction'];
		} else {
			$item['transactions'] = [];
		}
		array_push($accountHistory, $item);
	}
}
	
if ($accountHistory) {
	// set response code - 200 ok
    http_response_code(200);
    echo json_encode($accountHistory);
} else {
	// set response code - 503 service unavailable
    http_response_code(503);
	echo json_encode(array("message" => "Unable to get Accounts History data."));
}
?>
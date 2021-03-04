<?php
// Add additional account data that is not at Ally Invest
// Ally Invest API call will be to retrieve quote data

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// HOLDINGS IN CSV FILE 
$filePath = '../data/extra_accounts.csv';
  
$csv = array();
$file = fopen($filePath, 'r');

while (($result = fgetcsv($file)) !== false)
{
    $csv[] = $result;
}

fclose($file);

//account template
$accountTempate = '{"account":"accountname","accountbalance":{"accountvalue":"0.0","money":{"cashavailable":"0.0"}},"accountholdings":{"holding":[]}}';
$accountTempArray = json_decode($accountTempate,true);
//holding template
$holdingTemplate = '{"costbasis":"0.0","instrument":{"cusip":""},"displaydata":{"symbol":"symbol","desc":"desc","qty":"0"},"gainloss":"0.0","marketvalue":"0.0","marketvaluechange":"0.0","price":"0.0"}';
$holdingTempArray = json_decode($holdingTemplate,true);

$response = array();
// header: account,symbol,desc,qty,costbasis

// create unique accounts in response
for ($i = 1; $i < count($csv); $i++) {
	$found = false;
	foreach($response as $acct) {
		if ($acct['account'] == $csv[$i]['0']) {
			$found = true;
		}
	}
	
	if (!$found) {
		$newAcct = $accountTempArray;
		$newAcct['account'] = $csv[$i]['0'];
		array_push($response,$newAcct);
	} 	
}

// add holdings to accounts
for ($i = 1; $i < count($csv); $i++) {
	for ($j = 0; $j < count($response); $j++) { 
		if ($response[$j]['account'] == $csv[$i]['0']) {
			$newHolding = $holdingTempArray;
			$newHolding['displaydata']['symbol'] = $csv[$i]['1'];
			$newHolding['displaydata']['desc'] = $csv[$i]['2'];
			$newHolding['displaydata']['qty'] = $csv[$i]['3'];
			$newHolding['costbasis'] = $csv[$i]['4'];
			array_push($response[$j]['accountholdings']['holding'], $newHolding);
		}
	}
}

echo json_encode($response);

?>
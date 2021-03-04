<?php
  // Ally Invest API keys
  // https://live.invest.ally.com/applications
  // https://www.ally.com/api/invest/documentation/getting-started/
  
  $consumer_key     = 'XXXXXXXXXX';
  $consumer_secret  = 'XXXXXXXXXX';
  $access_token     = 'XXXXXXXXXX';
  $access_secret    = 'XXXXXXXXXX';
  $oauth_nonce = '1234567890';
  // generated oauth signature from Postman to skip generating it myself for now
  $oauth_signature = 'XXXXXXXXXX';
  
  $OAuthHeader = 'Authorization: OAuth ' . 
  'oauth_consumer_key="' . $consumer_key . '",' .
  'oauth_token="' . $access_token . '",' . 
  'oauth_signature_method="HMAC-SHA1",' . 
  'oauth_signature="' . $oauth_signature . '",' . 
  'oauth_timestamp="' . time() . '",' .  
  'oauth_nonce="' . $oauth_nonce . '",' . 
  'oauth_version="1.0"';
?>
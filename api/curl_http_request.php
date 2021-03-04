<?php
function curl_http_request($method, $url, $data, $headers = false, $contentType = "application/json"){
	//https://weichie.com/blog/curl-api-calls-with-php/
   $curl = curl_init();

   switch ($method){
      case "POST":
         curl_setopt($curl, CURLOPT_POST, 1);
         if ($data)
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
         break;
      case "PUT":
         curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
         if ($data)
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);			 					
         break;
      default:
         if ($data)
            $url = sprintf("%s?%s", $url, http_build_query($data));
   }
   
   // OPTIONS:
   curl_setopt($curl, CURLOPT_URL, $url);
   if(!$headers){
       curl_setopt($curl, CURLOPT_HTTPHEADER, 
		array(
          'Content-Type: ' . $contentType,
       )
	  );
   }else{
	  curl_setopt($curl, CURLOPT_HTTPHEADER, 
		array(
          $headers,
		  'Accept: application/json',
          'Content-Type: ' . $contentType,
		)
	  );
   }
   curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
   curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
   
   // EXECUTE:
   $result = curl_exec($curl);

   if(!$result){die("Connection Failure");}
   curl_close($curl);
   return $result;
}

?>
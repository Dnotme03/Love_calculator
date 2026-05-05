<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$url = "https://lofo-perfumes-server.vercel.app/api/products";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$response = curl_exec($ch);

curl_close($ch);

echo $response;

?>

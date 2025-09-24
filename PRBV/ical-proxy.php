<?php
// Very simple proxy for ICS files
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/calendar");

// validate & pass through
if (isset($_GET['url'])) {
    $url = urldecode($_GET['url']);
    // basic sanity check: must start with Beds24 domain
    if (strpos($url, "api.beds24.com") === 0 || strpos($url, "https://api.beds24.com") === 0) {
        echo file_get_contents($url);
    } else {
        http_response_code(403);
        echo "Forbidden";
    }
} else {
    http_response_code(400);
    echo "Missing url";
}

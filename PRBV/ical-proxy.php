<?php
// Minimal iCal proxy to bypass CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/calendar");

if (isset($_GET['url'])) {
    $url = urldecode($_GET['url']);
    // only allow .ics files
    if (preg_match('/^https:\\/\\/.+\\.ics$/i', $url)) {
        echo file_get_contents($url);
    } else {
        http_response_code(403);
        echo "Forbidden";
    }
} else {
    http_response_code(400);
    echo "Missing url";
}

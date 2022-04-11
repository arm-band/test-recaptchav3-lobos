<?php

$CONFIG = require_once(__DIR__ . '/config/config.php');

function err400() {
    header('HTTP/1.1 400 Bad Request.');
    include(__DIR__ . '/error.html');
    exit;
}
function success() {
    header('HTTP/1.1 200 OK.');
    include(__DIR__ . '/finish.html');
    exit;
}

$captchaResponse = filter_input(INPUT_POST, 'g-recaptcha-response');
if(!isset($captchaResponse) || empty($captchaResponse) || !is_string($captchaResponse)) {
    error_log('reCAPTCHA のレスポンスコードがセットされていません。');
    err400();
}
$siteKeyID       = filter_input(INPUT_POST, 'sitekey-number');
if((!isset($siteKeyID) || empty($siteKeyID) || !is_string($siteKeyID)) && $siteKeyID !== 0 && $siteKeyID !== '0') {
    error_log('サイトキーの番号が指定されていません。');
    err400();
}
$postParam       = filter_input(INPUT_POST, 'loslobos' . $siteKeyID);
$siteKeyID       = (int)$siteKeyID;
$secretKey       = $CONFIG['SECRETKEY' . (string)($siteKeyID + 1)];

// APIリクエスト
$verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret=' . $secretKey . '&response=' . $captchaResponse);

// APIレスポンス確認
$responseData = json_decode($verifyResponse);
if($siteKeyID === 0) {
    if ($responseData->success) {
        success();
    } else {
        error_log('error' . (string)($siteKeyID + 1) . ': reCAPTCHA の認証でエラーが発生しました。');
        err400();
    }
}
else if ($siteKeyID === 1) {
    if ($responseData->success && $responseData->score >= 0.95) {
        error_log('info' . (string)($siteKeyID + 1) . ': reCAPTCHA の認証が成功しました。');
        error_log('score:' . $responseData->score);
        success();
    } else {
        error_log('error' . (string)($siteKeyID + 1) . ': reCAPTCHA の認証でエラーが発生しました。');
        error_log('score:' . $responseData->score);
        err400();
    }
}
else {
    if ($responseData->success) {
        success();
    } else {
        error_log('error' . (string)($siteKeyID + 1) . ': reCAPTCHA の認証でエラーが発生しました。');
        err400();
    }
}

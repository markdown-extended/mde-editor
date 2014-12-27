<?php

// --------------- USER SETUP

$user_autoloader = null;
$mde_options = array();

// --------------- END USER SETUP

// show errors at least initially
@ini_set('display_errors','1'); @error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT);

// get the Composer autoloader
if (file_exists($a = __DIR__.'/../../../autoload.php')) {
    require_once $a;
} elseif (file_exists($b = __DIR__.'/../vendor/autoload.php')) {
    require_once $b;

} elseif (isset($user_autoloader) && file_exists($user_autoloader)) {
    require_once $user_autoloader;

// else error, classes can't be found
} else {
    die('You need to run Composer on your project to use this interface!');
}

// parse the "source" posted value
if (!empty($_POST) && isset($_POST['source'])) {
//    $posted = htmlspecialchars($_POST['source']);
    $posted = urldecode($_POST['source']);
    $posted = str_replace('&gt;', '>', $posted);
    $posted = str_replace('&lt;', '<', $posted);
    try {
        $mde_content = \MarkdownExtended\MarkdownExtended::create()
            ->transformString($posted, (isset($mde_options) ? $mde_options : array()));

//var_export($mde_content);

        echo
            $mde_content->getMetadataToString().PHP_EOL
            .$mde_content->getBody().PHP_EOL
            .$mde_content->getNotesToString();
    } catch (\Exception $e) {
        echo "error - ".$e->getMessage()." [".get_class($e)." in ".$e->getFile()."::".$e->getLine()."]";
    }
}
exit(0);

<?php
/**
 * MDE-Editor (http://github.com/piwi/mde-editor)
 * Copyright (c) 2014 Pierre Cassat (MIT Licensed)
 *
 * PHP script based on:
 *
 * PHP MarkdownExtended (http://github.com/piwi/markdown-extended)
 * Copyright (c) 2008-2014 Pierre Cassat (BSD Licensed)
 *
 *
 * This PHP interface will receive and handle each AJAX request with
 * the original markdown content to transform as "source" argument.
 * It just responds with parsed content (meta-data + body + notes).
 *
 * You may post the following data:
 * - "source" : the markdown source content
 * - "autoloader" : a path to the PHP autoloader (relative to this file)
 * - "options" : a JSON encode table of options passed to MDE parser
 *
 */

// show errors at least initially
@ini_set('display_errors','1'); @error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT);

// end here if no post data
if (empty($_POST) || !isset($_POST['source']) || empty($_POST['source'])) {
    exit(0);
}

// get the custom autoloader
$autoloader = __DIR__.'/../vendor/autoload.php';
if (isset($_POST['autoloader'])) {
    $autoloader = __DIR__.'/'.urldecode($_POST['autoloader']);
}

// load the autoloader if it exists
if (file_exists($autoloader)) {
    require_once $autoloader;
// else error, classes can't be found
} else {
    die('A PHP namespaces autoloader can not be found while using the MDE-editor interface!');
}

// get MDE options
$options = array();
if (isset($_POST['options'])) {
    $options = json_decode(urldecode($_POST['options']), true);
}
//var_export($options);

// parse the "source" posted value
$posted = urldecode($_POST['source']);
$posted = str_replace('&gt;', '>', $posted);
$posted = str_replace('&lt;', '<', $posted);
try {
    $mde_content = \MarkdownExtended\MarkdownExtended::create()
        ->transformString($posted, (isset($mde_options) ? $mde_options : $options));
    //var_export($mde_content);
    echo
        $mde_content->getMetadataToString().PHP_EOL
        .$mde_content->getBody().PHP_EOL
        .$mde_content->getNotesToString();
} catch (\Exception $e) {
    echo "error - ".$e->getMessage()." [".get_class($e)." in ".$e->getFile()."::".$e->getLine()."]";
}

exit(0);

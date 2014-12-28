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

// the global interface class
class MDE_Editor_Interface
{

    // static object creation
    private static $_instance;

    public static function create()
    {
        self::$_instance = new self;
        return self::$_instance;
    }

    // parse request
    public function distribute()
    {
        // end here if no post data
        if (empty($_POST) || !isset($_POST['source']) || empty($_POST['source'])) {
            $this->serve();
        }

        // distribute all data
        foreach ($_POST as $name=>$value) {
            $value = urldecode($value);
            switch ($name) {
                case 'options':
                    $value = json_decode($value, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        $this->addError(
                            sprintf('An error occurred while trying to decode JSON table of %s [code "%s"]!',
                                $name, json_last_error())
                        );
                        $value = array();
                    }
                    break;
                case 'source':
                    // parse the "source" posted value
                    $value = str_replace('&gt;', '>', $value);
                    $value = str_replace('&lt;', '<', $value);
            }
            $this->setData($name, $value);
        }

        // load the autoloader if it exists
        $autoloader = $this->getData('autoloader');
        if (!empty($autoloader)) {
            if (file_exists(__DIR__.'/'.$autoloader)) {
                require_once __DIR__.'/'.$autoloader;
            } else {
                $this->addError(
                    sprintf('The "%s" PHP namespaces autoloader can not be found!', $autoloader), true
                );
            }
        } else {
            $this->addError('A PHP namespaces autoloader is required!', true);
        }

        return $this;
    }

    // parse the content
    public function parse()
    {
        $source     = $this->getData('source');
        $options    = $this->getData('options', array());
        if (!empty($source)) {
            try {
                $mde_content = \MarkdownExtended\MarkdownExtended::create()
                    ->transformString($source, $options);
                //var_export($mde_content);
                $this->setContent(
                    $mde_content->getMetadataToString().PHP_EOL
                    .$mde_content->getBody().PHP_EOL
                    .$mde_content->getNotesToString()
                );
            } catch (\Exception $e) {
                $this->addError(
                    sprintf("caught exception - %s [%s in %s::%d]", $e->getMessage(), get_class($e), $e->getFile(), $e->getLine()),
                    true
                );
            }
        }
        return $this;
    }

    // serve the response
    public function serve($silent = false)
    {
        $result = json_encode(array(
            'status'    => $this->getStatus(),
            'content'   => $this->getContent(),
            'error'     => $this->getErrors()
        ));
        if (!$silent && json_last_error() !== JSON_ERROR_NONE) {
            $this->addError(
                sprintf('An error occurred while trying to encode result table to JSON [code "%s"]!', json_last_error())
            );
            $this->serve(true);
        }

        header('Content-type: application/json');
        echo $result;
        exit($this->getStatus());
    }

    // setters/getters
    protected $data     = array();
    protected $status   = 0;
    protected $content  = '';
    protected $errors   = array();

    public function setData($name, $value)
    {
        $this->data[$name] = $value;
        return $this;
    }
    public function getData($name, $default = null)
    {
        return (isset($this->data[$name]) ? $this->data[$name] : $default);
    }

    public function addError($str, $fatal = false)
    {
        $this->errors[] = $str;
        $this->setStatus($this->getStatus() + 1);
        if ($fatal) {
            $this->serve();
        }
        return $this;
    }
    public function getErrors()
    {
        return $this->errors;
    }

    public function setContent($str)
    {
        $this->content = $str;
        return $this;
    }
    public function getContent()
    {
        return $this->content;
    }

    public function setStatus($int)
    {
        $this->status = (int) $int;
        return $this;
    }
    public function getStatus()
    {
        return $this->status;
    }

}

// distribute the post request, parse received content and serve the JSON response
MDE_Editor_Interface::create()
    ->distribute()
    ->parse()
    ->serve();

// big oops!!
exit('Something has gone terribly wrong :(');

/**
 * MDE-Editor (http://github.com/piwi/mde-editor)
 * Copyright (c) 2014 Pierre Cassat (MIT Licensed)
 *
 * javascript based on:
 *
 * EpicEditor - An Embeddable JavaScript Markdown Editor (https://github.com/OscarGodson/EpicEditor)
 * Copyright (c) 2011-2012, Oscar Godson. (MIT Licensed)
 */

;(function (window, undefined) {

/**
 * Store the MDE parser options
 */
var mdeparser_options;

/**
 * Initiates the special EpicEditor object
 * @class Represents an EpicEditor instance
 * @param {object} options An optional customization object
 * @returns {object} EpicEditor will be returned
 */
function MdeEpicEditor(options) {
    var _this,
        mde_options,
        opts = options || {},
        defaults = {
            container:  'mde-epiceditor',
            basePath:   'bower_components/epiceditor/epiceditor/',
            parser:     mde_marked,
            file: {
                name: 'mde-epiceditor',
                defaultContent: 'Type your *markdown*-**extended** content here ...',
                autoSave: 5000
            },
            autogrow: true,
            parser_options: {
                silent:      false,
                interface:   'js/mde_interface.php',
                mde_options: {},
                autoloader:  '../vendor/autoload.php'
            }
        };

    mde_options = merge({}, defaults, opts);
//    console.debug('mdeparser options:', mde_options.parser_options);
    mdeparser_options = mde_options.parser_options;
//    console.debug('initializing MdeEpicEditor with options', mde_options);
    _this = new EpicEditor(mde_options);
    return _this;
}

/**
 * Recursive merge of objects
 * @param obj obj2 obj3 ...
 * @returns {*}
 */
function merge(obj) {
    var i = 1
        , target
        , key;
    for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                if (typeof obj[key] === 'object') {
                    obj[key] = merge(obj[key], target[key]);
                } else {
                    obj[key] = target[key];
                }
            }
        }
    }
    return obj;
}

/**
 * Creation of the AJAX request
 * @returns {ActiveXObject|*}
 */
function createRequest() {
    try {
        xhr = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (err2) {
        try {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (err3) {
            try {
                xhr = new XMLHttpRequest();
            } catch (err1) {
                throw 'Can not initiate XHR request!';
            }
        }
    }
    return xhr;
}

/**
 * MDE parser AJAX request
 * @param src
 * @returns {*}
 */
function mde_marked (src) {
    var ajax_response = src,
        opts = mdeparser_options,
        xhr,
        data;
    try {
        xhr = createRequest();
        if (xhr) {
            xhr.onreadystatechange  = function() {
                if (xhr.readyState  == 4) {
                    if (xhr.status  == 200) {
                        var response = JSON.parse(xhr.response);
//                        console.debug('receiving response from interface ', response);
                        if (response.status === 0) {
                            ajax_response = response.content;
                        } else {
                            console.error("Error on XHR response:\n" + response.error.join('\n'));
                        }
                    } else {
                        throw "Error on XHR request [code " + xhr.status + "]";
                    }
                }
            };
            data = "autoloader=" + encodeURIComponent(opts.autoloader) + "&"
                + "options=" + encodeURIComponent(JSON.stringify(opts.mde_options)) + "&"
                + "source=" + encodeURIComponent(src);
//            console.debug('sending data to interface '+opts.interface, data);
            xhr.open("POST", opts.interface,  false);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(data);
        }
    } catch (e) {
        if (opts.silent) {
            return "An error occured:\n" + e.message;
        }
        throw e;
    }
    return ajax_response;
}

window.MdeEpicEditor = MdeEpicEditor;

})(window);

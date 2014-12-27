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
            container: 'mde-epiceditor',
            textarea: 'mde-content',
            basePath: 'bower_components/epiceditor/epiceditor/',
            parser: mde_marked,
            file: {
                name: 'mde-epiceditor',
                defaultContent: 'Type your *markdown*-**extended** content here ...',
                autoSave: 5000
            },
            autogrow: true,
            parser_options: {
                silent: false,
                interface: 'js/mde_interface.php',
                mde_options: {},
                autoloader: '../vendor/autoload.php'
            }
        };

    mde_options = merge(defaults, opts);
//    console.debug('initializing MdeEpicEditor with options', mde_options);
    mdeparser_options = mde_options.parser_options;
    _this = new EpicEditor(mde_options);
    return _this;
}

/**
 * Recursive merge of objects
 * @param obj1 obj2 obj3 ...
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
 * MDE parser AJAX request
 * @param src
 * @param opt
 * @returns {*}
 */
function mde_marked(src, opt) {
    var ajax_response = null,
        xhr;
    try {
        try {
            xhr = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (err2) {
            try {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (err3) {
                try {
                    xhr = new XMLHttpRequest();
                } catch (err1) {
                    xhr = false;
                }
            }
        }
        if (xhr) {
            xhr.onreadystatechange  = function() {
                if (xhr.readyState  == 4) {
                    if (xhr.status  == 200) {
                        ajax_response = xhr.responseText;
                    } else {
                        console.log("Error on XHR request [code " + xhr.status + "]");
                        ajax_response = src;
                    }
                }
            };
            xhr.open("POST", mdeparser_options.interface,  false);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(
                "autoloader=" + encodeURIComponent(mdeparser_options.autoloader)
                + "&"
                + "options=" + encodeURIComponent(JSON.stringify(mdeparser_options.mde_options))
                + "&"
                + "source=" + encodeURIComponent(src)
            );
        } else {
            ajax_response = 'ERROR - Can not initiate XHR request!';
        }
    } catch (e) {
        if ((opt || mdeparser_options).silent) {
            return 'An error occured:\n' + e.message;
        }
        throw e;
    }
    return ajax_response;
}

window.MdeEpicEditor = MdeEpicEditor;

})(window);

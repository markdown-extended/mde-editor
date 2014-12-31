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
var mde_editor_options;

/**
 * Initiates the special EpicEditor object
 * @class Represents an EpicEditor instance
 * @param {object} options An optional customization object
 * @returns {object} EpicEditor will be returned
 */
function MdeEpicEditor(options) {
    var _this,
        settings,
        opts = options || {},
        defaults = {
            parser:     mde_editor,
            container:  'mde-editor',
            basePath:   'bower_components/epiceditor/epiceditor/',
            autogrow:   true,
            file: {
                name:           'mde-editor',
                defaultContent: 'Type your *markdown*-__extended__ content here ...',
                autoSave:       5000
            },
            parser_options: {
                silent:      false,
                interface:   'mde-editor/mde_editor_interface.php',
                mde_options: {}
            }
        };

    settings = merge({}, defaults, opts);
    mde_editor_options = settings.parser_options;
//    console.debug('mde_editor options:', mde_editor_options);
    delete settings.parser_options;
//    console.debug('initializing MdeEpicEditor with options', settings);
    _this = new EpicEditor(settings);
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
        xhr = new XMLHttpRequest();
    } catch (err2) {
        try {
            xhr = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (err3) {
            try {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
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
function mde_editor (src) {
    var xhr_response = src.replace(/(?:\r\n|\r|\n)/g, '<br />'),
        opts = mde_editor_options,
        xhr,
        data;
    try {
        xhr = createRequest();
        xhr.onreadystatechange  = function() {
            if (xhr.readyState  == 4) {
                var response = JSON.parse(xhr.response);
//                console.debug('receiving response from interface ', response);
                if (xhr.status  == 200) {
                    xhr_response = response.content;
                } else {
                    throw "Error on XHR response [status " + xhr.status + "]:\n" + response.errors.join('\n');
                }
            }
        };
        data = "options=" + encodeURIComponent(JSON.stringify(opts.mde_options)) + "&"
            + "source=" + encodeURIComponent(src);
//            console.debug('sending data to interface '+opts.interface, data);
        xhr.open("POST", opts.interface,  false);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(data);
    } catch (e) {
        if (opts.silent) {
            return "An error occured:\n" + e.message;
        }
        throw e;
    }
    return xhr_response;
}

window.MdeEpicEditor = MdeEpicEditor;

})(window);

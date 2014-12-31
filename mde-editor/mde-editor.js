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
 * The default distant API URL
 */
var MDEServiceOnlineURL = 'http://api.aboutmde.org/mde-api.php';

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
    var settings,
        opts = options || {},
        defaults = {
            parser:     mde_editor,
/*
            parser:     function(src) {
                if (src!='TEST') {
                    var args = arguments;
                    setTimeout(function(){ return mde_editor.apply(window, args); }, 2000);
                } else {
                    return mde_editor.apply(window, arguments);
                }
            },
*/
            container:  'mde-editor',
            basePath:   'bower_components/epiceditor/epiceditor/',
            autogrow:   true,
            file: {
                name:           'mde-editor',
                defaultContent: 'Type your *markdown*-__extended__ content here ...',
                autoSave:       5000
            },
            parserOptions: {
                silent:      false,
                loader:      '<div id="epiceditor-previewer-loader"><img src="mde-editor/indicator.gif" alt="loading ..." style="vertical-align: middle;" /> parsing content ...</div>',
                interface:   'mde-editor/mde_editor_interface.php',
                mdeOptions: {}
            }
        };

    settings = merge({}, defaults, opts);
    mde_editor_options = settings.parserOptions;
    if (mde_editor_options.interface == 'online') {
        mde_editor_options.interface = MDEServiceOnlineURL;
    }
//    console.debug('mde_editor options:', mde_editor_options);
    delete settings.parserOptions;
//    console.debug('initializing MdeEpicEditor with options', settings);
    mde_editor_options.epic_editor = new EpicEditor(settings);

    mde_editor_options.epic_editor.on('save', function(){
        var _self = mde_editor_options.epic_editor;
        _self.previewer.innerHTML = mde_editor_options.loader;
        if (!_self.is('fullscreen')) {
            _self.editorIframe.style.left = '-999999px';
            _self.previewerIframe.style.left = '';
            _self._eeState.preview = true;
            _self._eeState.edit = false;
            _self._focusExceptOnLoad();
        }
    });

    return mde_editor_options.epic_editor;
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
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.responseText !== undefined && xhr.responseText.length > 0) {
                    var response = JSON.parse(xhr.responseText);
//                    console.debug('receiving response from interface ', response);
                    if (xhr.status  == 200) {
                        xhr_response = response.content;
                    } else {
                        throw "Error on XHR response [status " + xhr.status + "]:\n" + response.errors.join('\n');
                    }
                } else {
                    throw "Empty XHR response, maybe a cross-domain issue?";
                }
            }
        };
        data = "options=" + encodeURIComponent(JSON.stringify(opts.mdeOptions)) + "&"
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

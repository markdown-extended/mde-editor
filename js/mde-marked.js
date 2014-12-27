
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
            parser_options: {
                silent: false,
                interface: 'js/mde_interface.php'
            },
            container: 'mde-epiceditor',
            textarea: 'mde-content',
            basePath: 'bower_components/epiceditor/epiceditor/',
            parser: mde_marked, //marked,
            file: {
                name: 'mde-epiceditor',
                defaultContent: 'Type your *markdown*-**extended** content here ...',
                autoSave: 5000
            },
            autogrow: true
        };

    mde_options = merge(defaults, opts);
    mdeparser_options = mde_options.parser_options;
    _this = new EpicEditor(mde_options);
    return _this;
}

function merge(obj) {
    var i = 1
        , target
        , key;

    for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key];
            }
        }
    }

    return obj;
}

function MdeParser(src, opt) {
    var ajax_response = null,
        xhr;
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
        xhr.send("source="+encodeURIComponent(src));
    } else {
        ajax_response = 'ERROR - Can not initiate XHR request!';
    }
    return ajax_response;
}

function mde_marked(src, opt) {
    try {
        return MdeParser(src, opt);
    } catch (e) {
        e.message += '\nPlease report this to http://github.com/piwi/mde-editor.';
        if ((opt || mdeparser_options).silent) {
            return 'An error occured:\n' + e.message;
        }
        throw e;
    }
}

window.MdeEpicEditor = MdeEpicEditor;

})(window);

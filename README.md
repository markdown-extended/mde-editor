MDE-Editor
==========

**A web editor for the Markdown-Extended (*MDE*) syntax.**

This editor is a custom version of the original [EpicEditor](http://epiceditor.com/)
to use the [PHP MarkdownExtended](http://github.com/piwi/markdown-extended) parser.
It uses the [MDE-Service](http://github.com/piwi/mde-service) PHP interface to post 
the markdown content of the editor (via a **synchronous** XMLHttpRequest) at each run 
(the original content is not parsed in JavaScript).


Installation
------------

To install and use it, you will need [Bower](http://bower.io/) and [Composer](http://getcomposer.org/):

    wget --no-check-certificate https://github.com/piwi/mde-editor/archive/master.tar.gz
    tar -xvf master.tar.gz
    cd mde-editor-master
    bower install
    composer install

Then you can browse the demonstration page: <http://your.localhost/path/to/mde-editor-master/>.


Usage
-----

Usage of the **MDE-Editor** is very similar to the one of [EpicEditor](http://epiceditor.com/#quick-start)
except that:

- you must include the `mde-editor.js` script AFTER the original `epiceditor(.min).js`:

        <script src="mde-editor/mde-editor.js"></script>

- you must create a `MdeEpicEditor` object instead of the original `EpicEditor`:
 
        var editor = new MdeEpicEditor().load();

- the default ID of the DOM block which will finally embed the editor is `mde-editor`:

        <div id="mde-editor"></div>

If you move the package files, you NEED to keep the `mde_editor_interface.php` PHP script
in the same directory as the `mde-editor.js` (or override the `parser_options` settings - 
see below) and redefine the `basePath` option to fit your environment. You also need to 
redefine the `$autoloader` variable at the top of the `mde_editor_interface.php` script.


Options
-------

The default options of the **MDE-Editor** are (they will be merged with the 
[default EpicEditor options](http://epiceditor.com/#epiceditoroptions) in final object):

        container:  'mde-editor',
        basePath:   'bower_components/epiceditor/epiceditor/',
        autogrow:   true,
        file: {
            name:           'mde-editor',
            defaultContent: 'Type your *markdown*-**extended** content here ...',
            autoSave:       5000
        },
        parser_options: {
            silent:      false,
            interface:   'mde-editor/mde_editor_interface.php',
            mde_options: {}
        }

The last `parser_options` element concerns the MDE parser:

-   the `parser_options.interface` is the path to the PHP interface file from the
    current document;

-   the `parser_options.mde_options` entry is a table of options passed to the 
    [PHP-MarkdownExtended](https://github.com/piwi/markdown-extended#php-script-usage) 
    parser to let you make custom parsings.


License
-------

**MDE-Editor** is authored by Pierre Cassat and licensed under a MIT license.

To transmit a bug or a feature request, see <http://github.com/piwi/mde-editor/issues>.

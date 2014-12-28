MDE-Editor
==========

**A web editor for Markdown-Extended (*MDE*) syntax.**

This editor is a custom version of the original [EpicEditor](http://epiceditor.com/)
to use the [PHP MarkdownExtended](http://github.com/piwi/markdown-extended) parser.
It uses a PHP interface to post the markdown content of the editor (via a **synchronous**
XMLHttpRequest).


Installation
------------

To install and use it, you will need [Bower](http://bower.io/) and [Composer](http://getcomposer.org):

    wget --no-check-certificate https://github.com/piwi/mde-editor/archive/master.tar.gz
    tar -xvf master.tar.gz
    cd mde-editor-master
    bower install
    composer install

Then you can browse the demonstration page: <http://your.localhost/path/to/mde-editor-master/>.


Usage
-----

Usage of the **MDE-Editor** is very similar to the one of [EpicEditor](http://epiceditor.com/#quick-start)
except that you must create a `MdeEpicEditor` object:
 
    var editor = new MdeEpicEditor().load();

And the default ID of the DOM block which will finally embed the editor is `mde-expiceditor`:

    <div id="mde-epiceditor"></div>


Options
-------

The default options of the **MDE-Editor** are (they will be merged with the 
[default EpicEditor options](http://epiceditor.com/#epiceditoroptions) in final object):

        container: 'mde-epiceditor',
        textarea: 'mde-content',
        basePath: 'bower_components/epiceditor/epiceditor/',
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

The last `parser_options` element concerns the MDE parser:

-   the `parser_options.autoloader` is the path to the PHP autoloader file,
    relative to the source file `js/mde_interface.php`;

-   the `parser_options.mde_options` entry is a table of options passed to the 
    [PHP-MarkdownExtended](https://github.com/piwi/markdown-extended#php-script-usage) 
    parser to let you make custom parsings.


License
-------

**MDE-Editor** is authored by Pierre Cassat and licensed under a MIT license.

To transmit a bug or a feature request, see <http://github.com/piwi/mde-editor/issues>.

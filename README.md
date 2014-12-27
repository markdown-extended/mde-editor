MDE-Editor
==========

A web editor for Markdown-Extended syntax.

This editor is a custom version of the original [EpicEditor](http://epiceditor.com/)
to use the [PHP MarkdownExtended](http://github.com/piwi/markdown-extended) parser.
It uses a PHP interface to post the markdown content of the editor (via a **synchronous**
AJAX request).

To install and use it, you will need [Bower](http://bower.io/) and [Composer](http://getcomposer.org):

    wget --no-check-certificate https://github.com/piwi/mde-editor/archive/master.tar.gz
    tar -xvf master.tar.gz
    cd mde-editor-master
    bower install
    composer install

Then you can browse the demonstration page: <http://your.localhost/path/to/mde-editor-master/>.

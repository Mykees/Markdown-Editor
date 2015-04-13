'use strict';
var app = angular.module('MarkdownEditor',['ngSanitize'])
.controller('EditorCtrl',['$scope','ConvertText','TurnToFullScreen', function($scope,ConvertText,TurnToFullScreen){
        var textarea = document.querySelector("#editor__content");
        var container = document.querySelector("#editor__container");
        $scope.full = false;


        $scope.content_parse = function(content){
            var $parser = new Markdown.Converter();

            if(content != null)
            {
                var text_parse = $parser.makeHtml(content);
                return text_parse;
            }
        };

        $scope.$watch('content',function(newValue,oldValue){
        });

        $scope.bold = function(){
            $scope.content = ConvertText.bold(textarea,$scope.content);
        };
        $scope.italic = function(){
            $scope.content = ConvertText.italic(textarea,$scope.content);
        };
        $scope.link = function(){
            $scope.content = ConvertText.link(textarea,$scope.content);
        };
        $scope.image = function(){
            $scope.content = ConvertText.image(textarea,$scope.content);
        };
        $scope.code = function(){
            $scope.content = ConvertText.code(textarea,$scope.content);
        };
        $scope.screen = function(){
            $scope.full = TurnToFullScreen.screen(container,document,$scope.full);
        };


        var __modal = (function(){
            var method = {},
                $overlay,
                $modal,
                $content,
                $close,
                $span,
                $win     = angular.element(window),
                $doc     = angular.element(document),
                $body    = angular.element(document.getElementsByTagName('body')[0]);


            $overlay = document.createElement('div');
            $overlay.classname = 'overlay';
            $overlay.id = 'overlay';

            $modal   = document.createElement('div');
            $modal.classname = "modal animated fadeIn";
            $modal.id = 'modal';

            $content = document.createElement('div');
            $content.classname = "modal__content";
            $content.id = "modalcontent";

            $span = document.createElement('span');
            $span.classname = "icon-close";

            $close = document.createElement('a');
            $close.classname = "close";
            $close.id = "close";

            $close.appendChild($span);
            $modal.appendChild($content).appendChild($close);

            return method;
        }());

}])
.directive('ngHandleTab', function(){

    return {
        link: function(scope,elem,attrs)
        {
            var textarea = elem[0];
            textarea.onkeydown = function(e) {
                if (e.keyCode === 9) { // tab was pressed

                    // get caret position/selection
                    var val = this.value,
                        start = this.selectionStart,
                        end = this.selectionEnd;

                    // set textarea value to: text before caret + tab + text after caret
                    this.value = val.substring(0, start) + '\t' + val.substring(end);

                    // put caret at right position again
                    this.selectionStart = this.selectionEnd = start + 1;

                    // prevent the focus lose
                    return false;

                }
            };
        }
    }
})
.factory('ConvertText',function() {
    var factory = {
        content :'',

        convert: function(type, textarea,content)
        {

            if (document.selection)
            {
                textarea.focus();
                var sel = document.selection.createRange();

                // Finally replace the value of the selected text with this new replacement one
                sel.text = character+ sel.text + character;
            }

            var len = textarea.value.length;
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;
            var sel = textarea.value.substring(start, end);
            var replace = false;
            var regex = false;
            var regexGlobal = false;
            var character = false;
            var testRegex = false;
            if(len > 0)
            {
                if(type === 'bold')
                {
                    regex = /\*/;
                    regexGlobal = /\*/g;
                    character = '**';
                    testRegex = true;
                }else if(type =='italic')
                {
                    regex = /\*/;
                    regexGlobal = /\*/g;
                    character = '*';
                    testRegex = true;
                }

                if(testRegex)
                {
                    if (regex.test(sel)) {
                        replace = sel.replace(regexGlobal,'');
                    } else {
                        replace = character + sel.trim() + character + ' ';
                    }
                }else{
                    if( type == 'link')
                    {
                        replace = '[' + sel.trim() + ']()' + ' ';
                    }else if(type == 'code')
                    {
                        replace = '```' + sel.trim() + '```' + ' ';
                    }else if(type === 'image' && sel != '')
                    {
                        replace = '![' + sel + ']()';
                    }
                }
            }
            if(type === 'image' && sel == '')
            {
                replace = "![]()";
            }

            // Here we are replacing the selected text with this one
            //textarea.value =  textarea.value.substring(0,start) + replace + textarea.value.substring(end,len);
            if(replace != false)
            {
                factory.content = textarea.value.substring(0,start) + replace + textarea.value.substring(end,len);
            }
        },

        bold: function(textarea,content)
        {
            factory.convert('bold',textarea,content);
            return factory.content;
        },
        italic: function(textarea,content)
        {
            factory.convert('italic',textarea,content);
            return factory.content;
        },
        link: function(textarea,content)
        {
            factory.convert('link',textarea,content);
            return factory.content;
        },
        image: function(textarea,content)
        {
            factory.convert('image',textarea,content);
            return factory.content;
        },
        code: function(textarea,content)
        {
            factory.convert('code',textarea,content);
            return factory.content;
        }
    }

    return factory;

})
.factory('TurnToFullScreen',function(){
     var factory = {
         isFullFactory: '',
         screen: function(container,document,isFull)
         {
             if (!isFull) {
                 if (container.requestFullScreen) {
                     container.requestFullScreen();
                 }

                 if (container.mozRequestFullScreen) {
                     container.mozRequestFullScreen();
                 }

                 if (container.webkitRequestFullScreen) {
                     container.webkitRequestFullScreen();
                 }

                 isFull = true;
             } else {

                 if (document.cancelFullScreen) {
                     document.cancelFullScreen();
                 }

                 if (document.webkitCancelFullScreen) {
                     document.webkitCancelFullScreen();
                 }

                 if (document.mozCancelFullScreen) {
                     document.mozCancelFullScreen();
                 }

                 isFull = false;
             }
             factory.isFullFactory = isFull;

             return factory.isFullFactory;
         }
     }

     return factory;
})
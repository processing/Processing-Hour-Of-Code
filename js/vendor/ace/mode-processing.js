/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * Contributor(s):
 *
 *
 *
 * ***** END LICENSE BLOCK ***** */

define('ace/mode/processing', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/processing_highlight_rules', 'ace/mode/folding/cstyle'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var ProcessingHighlightRules = require("./processing_highlight_rules").ProcessingHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = ProcessingHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "/\\*";
    this.blockComment = {start: "/*", end: "*/"};
}).call(Mode.prototype);

exports.Mode = Mode;
});

define('ace/mode/processing_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var ProcessingHighlightRules = function() {

    this.$rules = { start: 
       [
        { token: 'support.function.color.java-processing',
          regex: '\\b(stroke|fill|background)\\b' },
        { token: 'support.function.java-processing',
           regex: '\\b(abs|acos|alpha|alpha|ambient|ambientLight|append|applyMatrix|arc|asin|atan2|atan|background|beginCamera|beginShape|bezier|bezierDetail|bezierPoint|bezierTangent|bezierVertex|binary|blend|blend|blue|boolean|box|brightness|byte|cache|camera|ceil|char|charAt|color|colorMode|concat|constrain|contract|copy|copy|cos|createFont|cursor|curve|curveDetail|curvePoint|curveSegments|curveTightness|curveVertex|day|degrees|delay|directionalLight|dist|duration|ellipse|ellipseMode|emissive|endCamera|endShape|equals|exp|expand|fill|filter|filter|float|floor|framerate|frustum|get|get|green|hex|hint|hour|hue|image|imageMode|indexOf|int|join|keyPressed|keyReleased|length|lerp|lightFalloff|lightSpecular|lights|line|link|list|loadBytes|loadFont|loadImage|loadPixels|loadSound|loadStrings|log|lookat|loop|loop|mag|mask|max|millis|min|minute|modelX|modelY|modelZ|month|mouseDragged|mouseMoved|mousePressed|mouseReleased|nf|nfc|nfp|nfs|noCursor|noFill|noLoop|noLoop|noSmooth|noStroke|noTint|noise|noiseDetail|noiseSeed|normal|open|openStream|ortho|param|pause|perspective|play|point|pointLight|popMatrix|pow|print|printCamera|printMatrix|printProjection|println|pushMatrix|quad|radians|random|randomSeed|rect|rectMode|red|redraw|resetMatrix|reverse|rotate|rotateX|rotateY|rotateZ|round|saturation|save|saveBytes|saveFrame|saveStrings|scale|screenX|screenY|screenZ|second|set|set|shininess|shorten|sin|size|smooth|sort|specular|sphere|sphereDetail|splice|split|spotLight|sq|sqrt|status|stop|str|stroke|strokeCap|strokeJoin|strokeWeight|subset|substring|switch|tan|text|textAlign|textAscent|textDescent|textFont|textLeading|textMode|textSize|textWidth|texture|textureMode|time|tint|toLowerCase|toUpperCase|translate|triangle|trim|unHint|unbinary|unhex|updatePixels|vertex|volume|year|draw|setup)\\b' },
         { token: 'punctuation.definition.comment.java-processing',
           regex: '/\\*\\*/' },
         { token: 'punctuation.definition.comment.java-processing',
           regex: '/\\*',
           push: 
            [ { token: 'punctuation.definition.comment.java-processing',
                regex: '\\*/',
                next: 'pop' },
              { defaultToken: 'comment.block.java-processing' } ] },
         { token: 'storage.type.java-processing',
           regex: '\\b(class|interface|void|color|string|byte|short|char|int|long|float|double|boolean|[A-Z][A-Za-z0-9]+)\\b' },
         { caseInsensitive: true,
           token: 'storage.modifier.access-control.java-processing',
           regex: '\\b(private|protected|public)\\b' },
         { caseInsensitive: true,
           token: 'storage.modifier.java-processing',
           regex: '\\b(abstract|final|native|static|transient|synchronized|volatile|strictfp|extends|implements)\\b' },
         { token: 'keyword.control.catch-exception.java-processing',
           regex: '\\b(try|catch|finally|throw)\\b' },
         { token: 'keyword.control.java-processing',
           regex: '\\b(return|break|case|continue|default|do|while|for|switch|if|else)\\b' },
         { token: 'keyword.other.class-fns.java-processing',
           regex: '\\b(import|new|package|throws)\\b' },
         { caseInsensitive: true,
           token: 'keyword.operator.java-processing',
           regex: '\\b(instanceof)\\b' },
         { token: 'constant.language.java-processing',
           regex: '\\b(false|null|true)\\b' },
         { caseInsensitive: true,
           token: 'constant.other.java-processing',
           regex: '\\b(focused|frameCount|frameRate|height|height|key|keyCode|keyPressed|mouseButton|mousePressed|mouseX|mouseY|online|pixels|pmouseX|pmouseY|screen|width)\\b' },
         { token: 'support.constant.java-processing',
           regex: '\\b(ADD|ALIGN_CENTER|ALIGN_LEFT|ALIGN_RIGHT|ALPHA|ALPHA_MASK|ALT|AMBIENT|ARGB|ARROW|BACKSPACE|BEVEL|BLEND|BLEND|BLUE_MASK|BLUR|CENTER|CENTER_RADIUS|CHATTER|CODED|COMPLAINT|COMPONENT|COMPOSITE|CONCAVE_POLYGON|CONTROL|CONVEX_POLYGON|CORNER|CORNERS|CROSS|CUSTOM|DARKEST|DEGREES|DEG_TO_RAD|DELETE|DIFFERENCE|DIFFUSE|DISABLED|DISABLE_TEXT_SMOOTH|DOWN|ENTER|EPSILON|ESC|GIF|GREEN_MASK|GREY|HALF|HALF_PI|HALF_PI|HAND|HARD_LIGHT|HSB|IMAGE|INVERT|JAVA2D|JPEG|LEFT|LIGHTEST|LINES|LINE_LOOP|LINE_STRIP|MAX_FLOAT|MITER|MODEL|MOVE|MULTIPLY|NORMALIZED|NO_DEPTH_TEST|NTSC|ONE|OPAQUE|OPENGL|ORTHOGRAPHIC|OVERLAY|P2D|P3D|PAL|PERSPECTIVE|PI|PI|PIXEL_CENTER|POINTS|POLYGON|POSTERIZE|PROBLEM|PROJECT|QUADS|QUAD_STRIP|QUARTER_PI|RADIANS|RAD_TO_DEG|RED_MASK|REPLACE|RETURN|RGB|RIGHT|ROUND|SCREEN|SECAM|SHIFT|SOFT_LIGHT|SPECULAR|SQUARE|SUBTRACT|SVIDEO|TAB|TARGA|TEXT|TFF|THIRD_PI|THRESHOLD|TIFF|TRIANGLES|TRIANGLE_FAN|TRIANGLE_STRIP|TUNER|TWO|TWO_PI|TWO_PI|UP|WAIT|WHITESPACE)\\b' },
         { token: 'support.class.java-processing',
           regex: '\\b(Array|Character|Integer|Math|Object|PFont|PImage|PSound|StringBuffer|Thread)\\b' },
         { token: 'variable.language.java-processing',
           regex: '\\b(this|super)\\b' },
         { token: 'constant.numeric.java-processing',
           regex: '\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)([LlFfUuDd]|UL|ul)?\\b' },
         { token: 'punctuation.definition.string.begin.java-processing',
           regex: '"',
           push: 
            [ { token: 'constant.character.escape.java-processing',
                regex: '\\\\.' },
              { token: 'punctuation.definition.string.end.java-processing',
                regex: '"',
                next: 'pop' },
              { defaultToken: 'string.quoted.double.java-processing' } ] },
         { token: 'punctuation.definition.string.begin.java-processing',
           regex: '\'',
           push: 
            [ { token: 'constant.character.escape.java-processing',
                regex: '\\\\.' },
              { token: 'punctuation.definition.string.end.java-processing',
                regex: '\'',
                next: 'pop' },
              { defaultToken: 'string.quoted.single.java-processing' } ] },
         { include: 'source.java' } ] }
    
    this.normalizeRules();
};

ProcessingHighlightRules.metaData = { fileTypes: [ 'pde' ],
      name: 'Processing',
      scopeName: 'source.processing' }


oop.inherits(ProcessingHighlightRules, TextHighlightRules);

exports.ProcessingHighlightRules = ProcessingHighlightRules;
});

define('ace/mode/folding/cstyle', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/range', 'ace/mode/folding/fold_mode'], function(require, exports, module) {


var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {

    this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i + match[0].length, 1);
        }

        if (foldStyle !== "markbeginend")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };

}).call(FoldMode.prototype);

});
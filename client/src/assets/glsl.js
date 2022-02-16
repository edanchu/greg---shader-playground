module.exports = function (CodeMirror) {
    CodeMirror.defineMode("glsl", function (config, parserConfig) {
        var indentUnit = config.indentUnit,
            keywords = parserConfig.keywords || words(glslKeywords),
            builtins = parserConfig.builtins || words(glslBuiltins),
            blockKeywords = parserConfig.blockKeywords || words("case do else for if switch while struct"),
            atoms = parserConfig.atoms || words("null"),
            hooks = parserConfig.hooks || {},
            multiLineStrings = parserConfig.multiLineStrings;
        var isOperatorChar = /[+\-*&%=<>!?|\/]/;

        var curPunc;

        function tokenBase(stream, state) {
            var ch = stream.next();
            if (hooks[ch]) {
                var result = hooks[ch](stream, state);
                if (result !== false) return result;
            }
            if (ch == '"' || ch == "'") {
                state.tokenize = tokenString(ch);
                return state.tokenize(stream, state);
            }
            if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
                curPunc = ch;
                return "bracket";
            }
            if (/\d/.test(ch)) {
                stream.eatWhile(/[\w\.]/);
                return "number";
            }
            if (ch == "/") {
                if (stream.eat("*")) {
                    state.tokenize = tokenComment;
                    return tokenComment(stream, state);
                }
                if (stream.eat("/")) {
                    stream.skipToEnd();
                    return "comment";
                }
            }
            if (ch == "#") {
                stream.eatWhile(/[\S]+/);
                stream.eatWhile(/[\s]+/);
                stream.eatWhile(/[\S]+/);
                stream.eatWhile(/[\s]+/);
                return "comment";
            }
            if (isOperatorChar.test(ch)) {
                stream.eatWhile(isOperatorChar);
                return "operator";
            }
            stream.eatWhile(/[\w\$_]/);
            var cur = stream.current();
            if (keywords.propertyIsEnumerable(cur)) {
                if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
                return "keyword";
            }
            if (builtins.propertyIsEnumerable(cur)) {
                return "builtin";
            }
            if (atoms.propertyIsEnumerable(cur)) return "atom";
            return "word";
        }

        function tokenString(quote) {
            return function (stream, state) {
                var escaped = false, next, end = false;
                while ((next = stream.next()) != null) {
                    if (next == quote && !escaped) { end = true; break; }
                    escaped = !escaped && next == "\\";
                }
                if (end || !(escaped || multiLineStrings))
                    state.tokenize = tokenBase;
                return "string";
            };
        }

        function tokenComment(stream, state) {
            var maybeEnd = false, ch;
            while (ch = stream.next()) {
                if (ch == "/" && maybeEnd) {
                    state.tokenize = tokenBase;
                    break;
                }
                maybeEnd = (ch == "*");
            }
            return "comment";
        }

        function Context(indented, column, type, align, prev) {
            this.indented = indented;
            this.column = column;
            this.type = type;
            this.align = align;
            this.prev = prev;
        }
        function pushContext(state, col, type) {
            return state.context = new Context(state.indented, col, type, null, state.context);
        }
        function popContext(state) {
            var t = state.context.type;
            if (t == ")" || t == "]" || t == "}")
                state.indented = state.context.indented;
            return state.context = state.context.prev;
        }

        // Interface

        return {
            startState: function (basecolumn) {
                return {
                    tokenize: null,
                    context: new Context((basecolumn || 0) - indentUnit, 0, "top", false),
                    indented: 0,
                    startOfLine: true
                };
            },

            token: function (stream, state) {
                var ctx = state.context;
                if (stream.sol()) {
                    if (ctx.align == null) ctx.align = false;
                    state.indented = stream.indentation();
                    state.startOfLine = true;
                }
                if (stream.eatSpace()) return null;
                curPunc = null;
                var style = (state.tokenize || tokenBase)(stream, state);
                if (style == "comment" || style == "meta") return style;
                if (ctx.align == null) ctx.align = true;

                if ((curPunc == ";" || curPunc == ":") && ctx.type == "statement") popContext(state);
                else if (curPunc == "{") pushContext(state, stream.column(), "}");
                else if (curPunc == "[") pushContext(state, stream.column(), "]");
                else if (curPunc == "(") pushContext(state, stream.column(), ")");
                else if (curPunc == "}") {
                    while (ctx.type == "statement") ctx = popContext(state);
                    if (ctx.type == "}") ctx = popContext(state);
                    while (ctx.type == "statement") ctx = popContext(state);
                }
                else if (curPunc == ctx.type) popContext(state);
                else if (ctx.type == "}" || ctx.type == "top" || (ctx.type == "statement" && curPunc == "newstatement"))
                    pushContext(state, stream.column(), "statement");
                state.startOfLine = false;
                return style;
            },

            indent: function (state, textAfter) {
                if (state.tokenize != tokenBase && state.tokenize != null) return 0;
                var firstChar = textAfter && textAfter.charAt(0), ctx = state.context, closing = firstChar == ctx.type;
                if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : indentUnit);
                else if (ctx.align) return ctx.column + (closing ? 0 : 1);
                else return ctx.indented + (closing ? 0 : indentUnit);
            },

            electricChars: "{}"
        };
    });

    function words(str) {
        var obj = {}, words = str.split(" ");
        for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
        return obj;
    }
    var glslKeywords = `const uniform layout centroid flat smooth
    break continue do for while switch case default
    if else in out inout float int void bool true false
    invariant discard return mat2 mat3 mat4
    mat2x2 mat2x3 mat2x4 mat3x2 mat3x3 mat3x4
    mat4x2 mat4x3 mat4x4 vec2 vec3 vec4 ivec2 
    ivec3 ivec4 bvec2 bvec3 bvec4 uint uvec2 uvec3 uvec4
    lowp mediump highp precision sampler2D sampler3D samplerCube
    sampler2DShadow samplerCubeShadow sampler2DArray sampler2DArrayShadow
    isampler2D isampler3D isamplerCube isampler2DArray
    usampler2D usampler3D usamplerCube usampler2DArray struct
    gl_FragCoord gl_FragDepth gl_FrontFacing gl_InstanceID gl_PointCoord
    gl_PointSize gl_Position gl_VertexID`;

    var glslBuiltins = `abs acos acosh all any asin asinh atan atanh ceil
        clamp cos cosh cross degrees determinant dFdx dFdx distance dot equal 
        exp exp2 faceforward floatBitsToInt floatBitsToInt floor fract fwidth
        greaterThan greaterThanEqual intBitsToFloat inverse inversesqrt isinf
        isnan length lessThan lessThanEqual log log2 matrixCompMult max min mix
        mod modf normalize not notEqual outerProduct packHalf2x16 packUnorm packUnorm 
        packUnorm pow radians reflect refract round roundEven sign sin sinh smoothstep
        sqrt step tan tanh texelFetch texelFetchOffset texture textureGrad textureGradOffset
        textureLod textureLodOffset textureOffset textureProj textureProjGrad 
        textureProjGradOffset textureProjLod textureProjLodOffset textureProjOffset
        textureSize transpose trunc intBitsToFloat unpackHalf2x16 unpackUnorm unpackUnorm
        unpackUnorm`;

    function cppHook(stream, state) {
        if (!state.startOfLine) return false;
        stream.skipToEnd();
        return "meta";
    }

    ; (function () {
        // C#-style strings where "" escapes a quote.
        function tokenAtString(stream, state) {
            var next;
            while ((next = stream.next()) != null) {
                if (next == '"' && !stream.eat('"')) {
                    state.tokenize = null;
                    break;
                }
            }
            return "string";
        }

        CodeMirror.defineMIME("text/x-glsl", {
            name: "glsl",
            keywords: words(glslKeywords),
            builtins: words(glslBuiltins),
            blockKeywords: words("case do else for if switch while struct"),
            atoms: words("null"),
            hooks: { "#": cppHook }
        });
    }());
}
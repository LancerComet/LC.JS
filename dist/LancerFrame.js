(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *  LancerFrame directive common functions By LancerComet at 15:11, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  指令模块通用函数文件.
 */

module.exports = {
    syncData: syncDataInSetter
};

var lcText = require('../data-bind/lc-text'),
    lcHtml = require('../data-bind/lc-html'),
    lcModel = require('../data-bind/lc-model'),
    lcCSS = require("../style-edit/lc-css");


// Definition: 数据绑定函数.
// 将在 getter / setter 中调用以进行如 lc-model、lc-text 等指令的数据同步.
function syncDataInSetter (ctrlDom, key, newValue) {

    // 循环控制器节点.
    for (var i = 0, length = ctrlDom.length; i < length; i++) {

        // 在每个控制器节点中初始化各指令.
        (function bindData(children) {  // children 为每个控制器节点下的后代元素.
            for (var i = 0, length = children.length; i < length; i++) {
                var child = children[i];

                // 如果没有这些修改 innerHTML 的指令.
                if (!child.attributes["lc-text"] && !child.attributes["lc-model"] && !child.attributes["lc-html"]) {
                    child.children.length > 0 && bindData(child.children);
                } else {
                    // 会修改 innerHTML 的指令.
                    // 开始进行数据绑定.
                    (child.attributes["lc-text"] && child.attributes["lc-text"].value === key) && lcText.syncData(child, newValue);
                    (child.attributes["lc-model"] && child.attributes["lc-model"].value === key) && lcModel.syncData(child, newValue);
                    (child.attributes["lc-html"] && child.attributes["lc-html"].value === key) && lcHtml.syncData(child, newValue);
                }

                lcCSS.setCSS(child, key, newValue);  // lc-css 的过滤将在函数内部进行.
            }
        })(ctrlDom[i].children);

    }

}
},{"../data-bind/lc-html":2,"../data-bind/lc-model":3,"../data-bind/lc-text":4,"../style-edit/lc-css":8}],2:[function(require,module,exports){
/*
 *  LancerFrame HTML directive By LancerComet at 12:13, 2016.03.17.
 *  # Carry Your World #
 *  ---
 *  lc-html 指令模块.
 */
var directiveName = "lc-html";

// lc-html 指令初始化函数(绑定数值).
module.exports = {
    init: initLcHTML,
    syncData: setData
};

function initLcHTML (children, scopeObj) {
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];

        if (!child.attributes[directiveName]) {
            child.children.length > 0 && initLcHTML(child.children, scopeObj);
            continue;
        }

        setData(child, scopeObj[child.attributes[directiveName].value]);
        // lc-html 不允许有子元素所以不进行子元素递归.
    }
}

function setData (element, value) {
    element.innerHTML = value;
}
},{}],3:[function(require,module,exports){
/*
 *  LancerFrame Model directive By LancerComet at 15:10, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-model 指令模块.
 */

var directiveName = "lc-model";

module.exports = {
    init: initLcModel,
    syncData: setData
};

// Definition: lc-model 指令绑定（初始化）.
function initLcModel (children, scopeObj, LancerFrame) {

    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];

        if (!child.attributes[directiveName]) {
            child.children.length > 0 && initLcModel(child.children, scopeObj, LancerFrame);
            continue;
        }

        var keyName = child.attributes[directiveName].value;
        child.value = scopeObj[keyName] ? scopeObj[keyName] : "";

        (function (keyName, child) {
            var imeIgnored = false;  // 忽略输入法状态控制标识.

            // 进入输入法输入状态时锁定控制标识.
            child.addEventListener("compositionstart", function () {
                imeIgnored = true;
            });

            // 当输入法状态恢复时释放控制标识.
            child.addEventListener("compositionend", function () {
                imeIgnored = false;
            });

            child.addEventListener("input", inputEvent, false);

            // Fixing: IE9 在 Backspace / Delete / 剪切时不触发 input 事件.
            // http://frontenddev.org/article/compatible-with-processing-and-chinese-input-method-to-optimize-the-input-events.html
            if (LancerFrame.BROWSER === "IE 9") {
                child.addEventListener("cut", function () {
                    console.log("cut event");
                    setTimeout(inputEvent, 1);  // 必须放置在任务队列中才生效.
                });

                child.addEventListener("keyup", function (event) {
                    console.log("keyup event");
                    event = event || window.event;
                    (event.keyCode === 46 || event.keyCode === 8) && inputEvent();
                });
            }

            // IE 下使用 KeyUp 进行数据绑定来避免输入法无效问题.
            if (LancerFrame.BROWSER.indexOf("IE") > -1) {
                child.addEventListener("keyup", function (event) {
                    console.log("keyup event");
                    event = event || window.event;
                    if (event.keyCode === 17 || event.keyCode === 18 || event.ctrlKey || event.shiftKey || event.altKey) { return; }
                    inputEvent();
                });
            }

            function inputEvent () {
                if (imeIgnored) { return; }
                scopeObj[keyName] = child.value;
            }

        })(keyName, child);

    }
}

// Definition: lc-model 双向数据绑定 set 中执行函数.
function setData (element, value) {
    element.value = value;
}
},{}],4:[function(require,module,exports){
/*
 *  LancerFrame Text directive By LancerComet at 15:03, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-text 指令模块.
 */

var directiveName = "lc-text";

// lc-text 指令初始化函数(绑定数值).
module.exports = {
    init: initLcText,
    syncData: setData
};

function initLcText (children, scopeObj) {
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];

        if (!child.attributes[directiveName]) {
            child.children.length > 0 && initLcText(child.children, scopeObj);
            continue;
        }

        setData(child, scopeObj[child.attributes[directiveName].value]);

        // lc-text 不允许有子元素所以不进行子元素递归.
    }
}

function setData (element, value) {
    element.innerText ? element.innerText = value : element.textContent = value;  // textContent for Firefox.
}
},{}],5:[function(require,module,exports){
/*
 *  LancerFrame Click directive By LancerComet at 2:11, 2016.03.06.
 *  # Carry Your World #
 *  ---
 *  lc-click 指令模块.
 */

var directiveName = "lc-click";

module.exports = {
    init: initLcClick
};

function initLcClick (elements, scopeObj) {
    for (var i = 0, length = elements.length; i < length; i++) {
        var element = elements[i];

        if (!element.attributes[directiveName]) {
            element.children.length && initLcClick(element.children, scopeObj);
            continue;
        }

        var clickEvent = scopeObj[element.attributes[directiveName].value];
        element.addEventListener("click", clickEvent, false);

    }
}
},{}],6:[function(require,module,exports){
/*
 *  LancerFrame MouseEnter directive By LancerComet at 17:17, 2016.03.17.
 *  # Carry Your World #
 *  ---
 *  lc-mouseenter 指令模块.
 */

var directiveName = "lc-mouseenter";

module.exports = {
    init: initLcMouseEnter
};

function initLcMouseEnter (elements, scopeObj) {
    for (var i = 0, length = elements.length; i < length; i++) {
        var element = elements[i];

        if (!element.attributes[directiveName]) {
            element.children.length && initLcMouseEnter(element.children, scopeObj);
            continue;
        }

        var event = scopeObj[element.attributes[directiveName].value];
        element.addEventListener("mouseenter", event, false);

    }
}
},{}],7:[function(require,module,exports){
/*
 *  LancerFrame MouseLeave directive By LancerComet at 17:17, 2016.03.17.
 *  # Carry Your World #
 *  ---
 *  lc-mouseleave 指令模块.
 */

var directiveName = "lc-mouseleave";

module.exports = {
    init: initLcMouseLeave
};

function initLcMouseLeave (elements, scopeObj) {
    for (var i = 0, length = elements.length; i < length; i++) {
        var element = elements[i];

        if (!element.attributes[directiveName]) {
            element.children.length && initLcMouseLeave(element.children, scopeObj);
            continue;
        }

        var event = scopeObj[element.attributes[directiveName].value];
        element.addEventListener("mouseleave", event, false);

    }
}
},{}],8:[function(require,module,exports){
/*
 *  LC-CSS Directive By LancerComet at 10:38, 2016/3/18.
 *  # Carry Your World #
 *  ---
 *  lc-css directive.
 */

module.exports = {
    init: initLcCSS,
    setCSS: setCSS
};

var directivePriefx = "lc-css";

// Definition: 指令初始化函数.
function initLcCSS (children, scopeObj) {
    // @ children: 控制器下的后代元素.
    // @ scopeObj: 控制器的 scope 对象.

    for (var i = 0, length = children.length; i < length; i++) {
        setCSS(children[i], null, null, scopeObj);
    }

}

// Definition: 双向数据绑定的样式同步函数.
function setCSS (element, key, value, scopeObj) {
    for (var i = 0, length = element.attributes.length; i < length; i++) {
        var attr = element.attributes[i];  // 遍历的当前属性.
        var attrName = attr.name;  // 属性名称: "lc-css-XXX" || 其他.

        if (attrName.indexOf(directivePriefx) < 0 || (key && attr.value !== key)) { continue; }  // 如果不是 "lc-css" 则继续循环.

        // 如果传来 scopeObj 则为初始化阶段调取.
        if (scopeObj) {
            value = scopeObj[attr.value];
        }

        var propName = attrName.substr(directivePriefx.length + 1);  // "从 lc-css-XXX" 获取 "XXX".
        cssModify(element, propName, value);  // 操作 CSS.
        // TODO: 去除页面指令依赖.
    }
}

// Definition: CSS 操作方法.
function cssModify (element, cssProp, value) {
    element.style[cssProp] = value;
}
},{}],9:[function(require,module,exports){
// Lancer Frame V0.0.1 By LancerComet at 16:44, 2016.02.29.
// # Carry Your World #

(function (root, undefined) {
    "use strict";
    var startTime = performance.now();
    console.log("StartTime: " + startTime);

    var LancerFrame = {};
    
    // Definition: 常量定义区.
    // =================================
    LancerFrame.VERSION = "0.0.1";
    LancerFrame.AUTHOR = "LancerComet";
    LancerFrame.BROWSER = require("./init/browser-detective")();
    
    
    // Definition: 静态方法定义区.
    // =================================    
    LancerFrame.controller = require("./module-func/controller").controller;  // 控制器定义方法.
    LancerFrame.domFuncs = {
        findChildrenByAttr: require("./static-func/find-children-by-attr")  // 使用属性扫描后代元素方法.
    };
    
    // Definition: 框架初始化.
    // =================================
    // 让框架在 DomContentLoaded 时进行初始化.
    // 如果没赶上, 则在 window.onload 时进行.
    // 如果还没赶上, 检测 document.readyState 是否为 complete, 是则直接执行.
    (function () {
        LancerFrame.inited = false;
        LancerFrame.init = require("./init/init");
        window.addEventListener("DOMContentLoaded", function () {
            console.log("Init at DOMContentLoaded");
            LancerFrame.init(LancerFrame);
            var endTime = performance.now();
            console.log("EndTime: " + endTime);
            console.log("Init takes " + (endTime - startTime));
        });
        window.addEventListener("load", function () {
            if (LancerFrame.inited) return;
            LancerFrame.init(LancerFrame);
        });
        setTimeout(function () {
            if (LancerFrame.inited) return;
            document.readyState === "complete" && LancerFrame.init(LancerFrame);
        }, 1);
    })();



    // Definition: 将 LancerFrame 挂载至全局环境.
    // =================================
    root.LancerFrame = root.lc = LancerFrame;


})(window);
},{"./init/browser-detective":10,"./init/init":11,"./module-func/controller":12,"./static-func/find-children-by-attr":13}],10:[function(require,module,exports){
/*
 *   Explorer Detective By LancerComet at 11:30, 2015/11/25.
 *   # Carry Your World #
 *   ---
 *
 *   信息:
 *   ---
 *   浏览器检测模块.
 *
 *   用法:
 *   ---
 *   var browserIs = require("func-explorer-detective")();  // browserIs 的值即为当前浏览器.
 *
 *   License：
 *   ---
 *   © 2015 LancerComet @ MIT License.
 *
 */

module.exports = explorerDetective;

function explorerDetective () {
    var userAgent = window.navigator.userAgent;
    var browser = {
        myBrowser : "unknown",
        database: [
            { type: "IE Legacy", regExp: "MSIE [1-6].*"},  // IE 1-6
            { type: "IE 7", regExp: "MSIE [7].*"},  // IE 7
            { type: "IE 8", regExp: "MSIE [8].*"},  // IE 8, 不支持 CSS3 与 HTML5.
            { type: "IE 9", regExp: "MSIE [9].*"},  // IE 9, 支持部分 CSS3 与 HTML5.
            { type: "IE Modern", regExp: "Trident/[6-9].*" },  // gt IE 10, 支持 CSS3 与 HTML5.
            //{ type: "IE No CSS3", regExp: "MSIE [1-9].*" },  // lt IE 10, 不支持 CSS3.
            { type: "Firefox", regExp: "Firefox/[0-9].*" },
            { type: "Safari", regExp: "AppleWebKit/[0-9].*.Safari/[0-9]" },
            { type: "Chrome", regExp: "AppleWebKit/[0-9].*.Chrome/[0-9].*.Safari/[0-9]" },
            { type: "Opera Presto", regExp: "Opera.[0-9].*.Presto/[0-9]" },
            { type: "Opera Modern", regExp: "OPR/[0-9][0-9]" },
            { type: "Edge", regExp: "Edge/[0-9].*" },
            { type: "Maxthon 4", regExp: "Maxthon/[4]" }
        ]
    };

    (function matchExplorer () {
        for (var i = 0, length = browser.database.length; i < length; i++) {
            var newRegExp = new RegExp(browser.database[i].regExp);
            if(userAgent.match(newRegExp)){
                browser.myBrowser = browser.database[i].type;
            }
        }
    })();

    return browser.myBrowser;
}

},{}],11:[function(require,module,exports){
/*
 *  "Module Define" module By LancerComet at 17:29, 2016.03.04.
 *  # Carry Your World #
 *  ---
 *  框架初始化模块.
 */

// Definition: 所有控制器存储对象.
var controllerMaps = require("./../module-func/controller").controllerMaps;
var initDirectives = [
    require("./../directives/data-bind/lc-model").init,
    require("./../directives/data-bind/lc-text").init,
    require("./../directives/data-bind/lc-html").init,

    require("./../directives/dom-events/lc-click").init,
    require("./../directives/dom-events/lc-mouseenter").init,
    require("./../directives/dom-events/lc-mouseleave").init,

    require("./../directives/style-edit/lc-css").init
];


module.exports = function (LancerFrame) {
    console.log("init");

    // Step1. 获取所有对象并提取 lc-controller 对象.
    var ctrls = document.querySelectorAll("[lc-controller]");
    
    // Step2. 遍历所有控制器节点, 并在相应的控制器中带入 controllerMaps 中的控制器数据对象并进行绑定.
    for (var i = 0, length = ctrls.length; i < length; i++) {
        var ctrl = ctrls[i];
        var ctrlName = ctrl.attributes["lc-controller"].value;
        
        // Definition: 控制器数据对象.
        /*
         *  {
         *      $controllerName: ctrlName,
         *      key1: value,
         *      key2: value,
         *      ...
         *  }
         */
        var scopeObj = controllerMaps[ctrlName];
        console.log(scopeObj);
        
        // Step3. 在子元素中开始初始化指令.
        var children = ctrl.children;
        (function () {
            for (var i = 0, length = initDirectives.length; i < length; i++) {
                initDirectives[i](children, scopeObj, LancerFrame);
            }
        })();
    }

    LancerFrame.inited = true;

};
},{"./../directives/data-bind/lc-html":2,"./../directives/data-bind/lc-model":3,"./../directives/data-bind/lc-text":4,"./../directives/dom-events/lc-click":5,"./../directives/dom-events/lc-mouseenter":6,"./../directives/dom-events/lc-mouseleave":7,"./../directives/style-edit/lc-css":8,"./../module-func/controller":12}],12:[function(require,module,exports){
/*
 *  "Module Define" module By LancerComet at 16:52, 2016.02.29.
 *  # Carry Your World #
 *  ---
 *  框架模块处理方法.
 * 
 *  包含方法:
 *  ---
 *   - 模块建立方法.
 *   - 模块引用方法.
 *  
 *  Inspired By http://www.ituring.com.cn/minibook/770.
 */

var syncData = require("./../directives/_common/common").syncData;

var controllerMaps = {};  // 存储所有控制器.

module.exports = {
    controller: controllerDefine,
    controllerMaps: controllerMaps
};

/* Definition goes below. */

// Definition: 框架控制器定义函数.
// lc.controller("ctrlName", ["moduleA"], function (scope) {})
function controllerDefine (ctrlName, dependencies, initFunc) {
    // @ params: 模块名称, 依赖模块, 模块初始化函数.
    
    if (Object.prototype.toString.call(dependencies) !== "[object Array]") {
        initFunc = dependencies;
        dependencies = [];
    }

    controllerMaps[ctrlName] = {
        $controllerctrlName: ctrlName  // 控制器名称.
    };
    
    // initFunc && initFunc(controllerMaps[ctrlName]);

    initFunc && (function () {
        initFunc(controllerMaps[ctrlName]);  // 将对象带入初始化函数中进行初始化.
        // 在 controllerMaps[ctrlName] 初始化完成后, 遍历每个用户设定的属性并设置 getter / setter.
        
        var scope = controllerMaps[ctrlName];  // Definition: 此控制器对象.
        
        // 之后为每个用户定义的属性中设置 getter / setter.
        for (var prop in scope) {
            if (!scope.hasOwnProperty(prop) || prop === "$controllerCtrlName") { continue; }
            
            // 在自执行函数中创建闭包来保留每个属性的 key 与 value 的各自引用 itemKey, itemValue 以避免属性相互干扰.
            // 同时保存各自的其他指令依赖的变量.
            (function () {
                var itemKey = prop;
                var itemValue = scope[prop];

                var ctrlDoms = null,  // 控制器节点. 放置此处以进行缓存.
                    lcIfNodes = null;  // lc-if 节点, 保存此属性控制的 lc-if 节点.


                Object.defineProperty(scope, itemKey, {
                    get: function () {
                        return itemValue;
                    },
                    set: function (newValue) {
                        // 获取控制器节点.
                        !ctrlDoms && (ctrlDoms = document.querySelectorAll("[lc-controller=" + ctrlName + "]"));

                        // 获取 lc-if 节点.
                        !lcIfNodes && (function () {
                            if (newValue) {

                            } else {

                            }
                        })();

                        console.log(ctrlName + "." + itemKey + " 从 " + itemValue + " 修改为 " + newValue);
                        itemValue = newValue;
                        syncData(ctrlDoms, itemKey, newValue);  // 更新控制器下所有 lc-text 和 lc-model 节点数据.
                    }
                });
            })();

        }

    })();

}

},{"./../directives/_common/common":1}],13:[function(require,module,exports){
/*
 *  Find Children By Attribute By LancerComet at 17:01, 2016/3/18.
 *  # Carry Your World #
 */

module.exports = function (parent, attr, value) {
    var children = parent.children;
    var result = [];

    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];

        // 如果匹配到了 attr = value.
        console.log(child.attributes[attr] ? child.attributes[attr].value : "no this attr")

        // 如果提供了 value 参数则匹配 value.
        if (value) {
            if (child.attributes[attr] && child.attributes[attr].value === value) {
                result.push(child);
            }
            if (child.children.length) {
                result = result.concat(findChildren(child, attr, value));
            }
        } else {  // 没有提供则不做 value 匹配.
            if (child.attributes[attr]) {
                result.push(child);
            }
            if (child.children.length) {
                result = result.concat(findChildren(child, attr, value));
            }
        }

    }

    return result;
};

},{}]},{},[9])
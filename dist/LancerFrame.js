(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Lancer Frame V0.0.1 By LancerComet at 16:44, 2016.02.29.
// # Carry Your World #

(function (root, undefined) {
    "use strict";

    var LancerFrame = {};
    
    // Definition: 常量定义区.
    // =================================
    LancerFrame.VERSION = "0.0.1";
    LancerFrame.AUTHOR = "LancerComet";
    
    
    // Definition: 静态方法定义区.
    // =================================    
    LancerFrame.controller = require("./module-func/module-func").controller;  // 模块定义方法.
    
    // Definition: 框架初始化.
    // =================================    
    
    root.LancerFrame = root.lc = LancerFrame;
    
    window.onload = function () {
        LancerFrame.init = require("./init/init").bind(null, LancerFrame);        
        LancerFrame.init();
    };

})(window);
},{"./init/init":2,"./module-func/module-func":3}],2:[function(require,module,exports){
/*
 *  "Module Define" module By LancerComet at 17:29, 2016.03.04.
 *  # Carry Your World #
 *  ---
 *  框架初始化模块.
 */

// Definition: 所有控制器存储对象.
var controllerMaps = require("./../module-func/module-func").controllerMaps;


module.exports = function (lc) {
    console.log("init")
    console.log(controllerMaps)
    
    // Step1. 获取所有对象并提取 lc-controller 对象.
    var $ctrls = document.querySelectorAll("[lc-controller]");
    
    // Step2. 遍历所有控制器节点, 并在相应的控制器中带入 controllerMaps 中的控制器数据对象并进行绑定.
    for (var i = 0, length = $ctrls.length; i < length; i++) {
        var $ctrl = $ctrls[i];
        var ctrlName = $ctrl.attributes["lc-controller"].value;
        
        // Definition: 控制器数据对象.
        /*
         *  {
         *      $controllerName: ctrlName,
         *      key1: value,
         *      key2: value,
         *      ...
         *  }
         * 
         */
        var ctrlData = controllerMaps[ctrlName];
        console.log(ctrlData)
        
        // Step3. 在子元素中开始初始化指令.
        var children = $ctrl.children;
        bindLcModel(children, ctrlData);
        bindLcText(children, ctrlData);

    }

}

// Definition: lc-model 指令绑定.
function bindLcModel (children, ctrlData) {    
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];    
        console.log(child)
        if (child.attributes["lc-model"]) {
            var keyName = child.attributes["lc-model"].value;
            child.value = ctrlData[keyName] ? ctrlData[keyName] : "";
        }
        
        // OnInput 时候进行双向数据绑定.
        child.addEventListener("input", function (event) {
            var target = event.target || event.srcElement;
            console.log(ctrlData);
            console.log(keyName)
            ctrlData[keyName] = target.value;
        }, false);  

        var grandChildren = child.children;
        if (grandChildren.length > 0) {
            bindLcModel(grandChildren, ctrlData);
        }

    }
}

// Definition: lc-text 指令绑定.
function bindLcText (children, ctrlData) {
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];
        if (!child.attributes["lc-text"]) continue;    
        
        var value = ctrlData[child.attributes["lc-text"].value];
        child.innerText = value;
        
        // lc-text 不允许有子元素所以不进行子元素递归.
    }
}
},{"./../module-func/module-func":3}],3:[function(require,module,exports){
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

var controllerMaps = {};  // 存储所有控制器.

module.exports = {
    controller: controllerDefine,
    controllerMaps: controllerMaps
};

/* Definition goes below. */

// Definition: 框架控制器定义函数.
// lc.define("someModule", ["moduleA", "moduleB"], function (moduleA, moduleB) {})
function controllerDefine (name, dependencies, initFunc) {
    // @ params: 模块名称, 依赖模块, 模块初始化函数.
    
    if (Object.prototype.toString.call(dependencies) !== "[object Array]") {
        initFunc = dependencies;
        dependencies = [];
    }
    
    controllerMaps[name] = {
        $controllerName: name  // 控制器名称.
    };
    
    initFunc && initFunc(controllerMaps[name]);

    // initFunc && (function () {
    //     // initFunc(controllerMaps[name]);  // 将对象带入初始化函数中进行初始化.
        
    //     // for (var item in scope) {
    //     //     if (!scope.hasOwnProperty(item)) { continue; }
    //     //     var keyValue = scope[item];
    //     //     Object.defineProperty(scope, item, {
    //     //         value: keyValue,
    //     //         writable: true,
    //     //         enumerable: true,
    //     //         configurable: true,
    //     //         get: function () {
    //     //             return keyValue;
    //     //         },
    //     //         set: function (newValue) {
    //     //             keyValue = newValue;                    
    //     //         }
    //     //     });
    //     // }       
        
    // })();
    
    console.log(controllerMaps)
}
},{}]},{},[1])
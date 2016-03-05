(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *  LancerFrame directive common functions By LancerComet at 15:11, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  指令模块通用函数文件.
 */

module.exports = {
    syncData: syncData
};

// Definition: 数据绑定函数.
// 将在 getter / setter 中调用以进行如 lc-model、lc-text 等指令的数据同步.
function syncData (ctrlName, key, newValue) {
    var ctrlDom = document.querySelector("[lc-controller=" + ctrlName + "]");

    (function bindData(children) {

        for (var i = 0, length = children.length; i < length; i++) {
            var child = children[i];

            if (!child.attributes["lc-text"] && !child.attributes["lc-model"]) {
                child.children.length > 0 && bindData(child.children);
                continue;
            };
            
            if (child.attributes["lc-text"] && child.attributes["lc-text"].value === key) console.log(child)
            if (child.attributes["lc-model"] && child.attributes["lc-model"].value === key) console.log(child)
            
            if (child.attributes["lc-text"] && child.attributes["lc-text"].value === key) lcText(child, newValue);
            if (child.attributes["lc-model"] && child.attributes["lc-model"].value === key) lcModel(child, newValue);
        }

    })(ctrlDom.children);
    
    
    
    // TODO: 观察在函数中创建函数是否引起内存溢出问题.
    // 进行 lc-text 的数据绑定.
    function lcText (target, newValue) {
        target.innerText = newValue;
    }
    
    
    // 进行 lc-model 的数据绑定.
    function lcModel (target, newValue) {
        target.value = newValue;
    }

}

function findChildren (parent, attr, value) {
    var children = parent.children;
    var result = [];

     for (var i = 0, length = children.length; i < length; i++) {
         var child = children[i];
         
         // 如果匹配到了 attr = value.
         console.log(child.attributes[attr] ? child.attributes[attr].value : "no this attr")
         if (child.attributes[attr] && child.attributes[attr].value === value) {
             result.push(child);
         }
         
         if (child.children.length) {
             result = result.concat(findChildren(child, attr, value));
         }
         
     }
     
     return result;     
}
},{}],2:[function(require,module,exports){
/*
 *  LancerFrame Model directive By LancerComet at 15:10, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-model 指令模块.
 */

module.exports = {
    bindLcModel: bindLcModel
};

// Definition: lc-model 指令绑定.
function bindLcModel (children, ctrlData) {    
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];
        
        if (!child.attributes["lc-model"]) {
            child.children.length > 0 && bindLcModel(child.children, ctrlData);
            continue;
        }
            
        var keyName = child.attributes["lc-model"].value;
        child.value = ctrlData[keyName] ? ctrlData[keyName] : "";
        
        // OnInput 时候进行双向数据绑定.
        child.addEventListener("input", function (event) {
            var target = event.target || event.srcElement;
            console.log(ctrlData);
            console.log(keyName)
            ctrlData[keyName] = target.value;
        }, false);  
  

    }
}

},{}],3:[function(require,module,exports){
/*
 *  LancerFrame Text directive By LancerComet at 15:03, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-text 指令模块.
 */

module.exports = {
    bindLcText: bindLcText  // lc-text 指令初始化函数(绑定数值).
};

function bindLcText (children, ctrlData) {
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];
        
        if (!child.attributes["lc-text"]) {
            child.children.length > 0 && bindLcText(child.children, ctrlData);
            continue;
        }
        
        var value = ctrlData[child.attributes["lc-text"].value];
        child.innerText = value;
        
        // lc-text 不允许有子元素所以不进行子元素递归.
    }
}
},{}],4:[function(require,module,exports){
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
    LancerFrame.controller = require("./module-func/controller").controller;  // 模块定义方法.
    
    // Definition: 框架初始化.
    // =================================    
    
    root.LancerFrame = root.lc = LancerFrame;
    
    window.onload = function () {
        LancerFrame.init = require("./init/init").bind(null, LancerFrame);        
        LancerFrame.init();
    };

})(window);
},{"./init/init":5,"./module-func/controller":6}],5:[function(require,module,exports){
/*
 *  "Module Define" module By LancerComet at 17:29, 2016.03.04.
 *  # Carry Your World #
 *  ---
 *  框架初始化模块.
 */

// Definition: 所有控制器存储对象.
var controllerMaps = require("./../module-func/controller").controllerMaps;
var bindLcModel = require("./../directives/lc-model/lc-model").bindLcModel;
var bindLcText = require("./../directives/lc-text/lc-text").bindLcText;


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
},{"./../directives/lc-model/lc-model":2,"./../directives/lc-text/lc-text":3,"./../module-func/controller":6}],6:[function(require,module,exports){
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
// lc.define("someModule", ["moduleA", "moduleB"], function (moduleA, moduleB) {})
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
        // 在 controllerMaps[ctrlName] 初始化完成后, 遍历每个用户设定的属性并设置为 getter / setter 进行双向数据绑定.
        
        var scope = controllerMaps[ctrlName];  // Definition: 此控制器对象.
        
        // 之后为每个用户定义的属性中设置 getter / setter.
        for (var item in scope) {
            if (!scope.hasOwnProperty(item) || item === "$controllerCtrlName") { continue; }
            
            // 在自执行函数中创建闭包来保留每个属性的 key 与 value 的各自引用 itemKey, itemValue 以避免属性相互干扰.
            (function () {
                var itemKey = item;                
                var itemValue = scope[item];
                Object.defineProperty(scope, itemKey, {
                    get: function () {
                        return itemValue;
                    },
                    set: function (newValue) {
                        console.log(ctrlName + "." + itemKey + " 从 " + itemValue + " 修改为 " + newValue);                                                
                        itemValue = newValue;
                        syncData(ctrlName, itemKey, newValue)  // 更新控制器下所有 lc-text 和 lc-model 节点数据.
                    }
                });
            })();

        }

    })();

}

},{"./../directives/_common/common":1}]},{},[4])
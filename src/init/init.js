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
    require("./../directives/dom-events/lc-mouseleave").init
];


module.exports = function (LancerFrame) {
    console.log("init");

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
         */
        var scopeObj = controllerMaps[ctrlName];
        console.log(scopeObj);
        
        // Step3. 在子元素中开始初始化指令.
        var children = $ctrl.children;
        (function () {
            for (var i = 0, length = initDirectives.length; i < length; i++) {
                initDirectives[i](children, scopeObj, LancerFrame);
            }
        })();
    }

    LancerFrame.inited = true;

};
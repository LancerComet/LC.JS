/*
 *  "Module Define" module By LancerComet at 17:29, 2016.03.04.
 *  # Carry Your World #
 *  ---
 *  框架初始化模块.
 */

// Definition: 所有控制器存储对象.
var controllerMaps = require("./../module-func/controller").controllerMaps;
var bindLcModel = require("./../directives/lc-model/lc-model");
var bindLcText = require("./../directives/lc-text/lc-text");
var bindLcClick = require("./../directives/lc-click/lc-click");


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
        var scopeObj = controllerMaps[ctrlName];
        console.log(scopeObj)
        
        // Step3. 在子元素中开始初始化指令.
        var children = $ctrl.children;
        bindLcModel(children, scopeObj);
        bindLcText(children, scopeObj);
        bindLcClick(children, scopeObj);

    }

}
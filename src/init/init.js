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
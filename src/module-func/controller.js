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

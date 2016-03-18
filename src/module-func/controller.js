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

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
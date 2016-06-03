// Lancer Frame V0.0.1 By LancerComet at 15:39, 2016.06.02.
// # Carry Your World #

import {_} from "../_/_"
export {controller}

// Definition: 框架控制器定义函数.
// lc.controller("ctrlName", ["moduleA"], function (scope) {})
function controller ($lc) {
    "use strict";
    
    $lc.controllers = {};
    $lc.controller = function (ctrlName, dependencies, initFunc) {
        // @ params: 模块名称, 依赖模块, 模块初始化函数.
        console.log("$lc.controller");
    
        if (_.typeof(dependencies) !== "array") {
            initFunc = dependencies;
            dependencies = [];
        }

        // 定义控制器作用域对象.
        // 对象将在之后加载用户属性.
        $lc.controllers[ctrlName] = {
            $name: ctrlName,
            $initFunc: initFunc
        };

        // 加载依赖模块.
        var initBind = true;
        for (let i = 0, length = dependencies.length; i < length; i++) {
            if (!$lc.controllers[dependencies] && !$lc.service[dependencies]) {
                console.log(`初始化 ${ctrlName} 时未找到依赖 ${dependencies[i]}, 请首先定义 ${dependencies[i]} 后再载入.`);
            } else {
                if (initBind) initFunc = initFunc.bind(null, $lc.controllers[ctrlName], $lc.directives)
            }
        }
    
    };

    
}


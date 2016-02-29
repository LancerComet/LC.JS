(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Lancer Frame V0.0.1 By LancerComet at 16:44, 2016.02.29.
// # Carry Your World #

(function (root, undefined) {
    "use strict";
    
    var LancerFrame = function () {
        
    };
    
    // Definition: 常量定义区.
    // =================================
    LancerFrame.VERSION = "0.0.1";
    
    
    // Definition: 静态方法定义区.
    // =================================    
    LancerFrame.define = require("./module-func/module-func").define;  // 模块定义方法.
    LancerFrame.require = require("./module-func/module-func").require;  // 模块引用方法. 
    
    
    root.LancerFrame = root.lc = LancerFrame;
    
})(window);
},{"./module-func/module-func":2}],2:[function(require,module,exports){
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

module.exports = {
    define: moduleDefine,
    require: moduleRequire
};


/* Definition goes below. */

var moduleMaps = {};

// Definition: 框架模块定义函数.
// lc.define("someModule", ["moduleA", "moduleB"], function (moduleA, moduleB) {})
function moduleDefine (name, dependencies, initFunc) {
    // @ params: 模块名称, 依赖模块, 模块初始化函数.
    
    if (!module[name]) {
        
        // 如果没有指定依赖则交换参数.
        if (typeof dependencies === "function") {
            initFunc = dependencies;
            dependencies = [];
        }
        
        var newModule = {
            name: name,
            dependencies: dependencies,
            initFunc: initFunc
        };
        
        moduleMaps[name] = newModule;
        
    }
    
    return moduleMaps[name];
    
}

// Definition: 框架模块引用方法.
// var someModule = lc.require("someModule");
function moduleRequire (name) {
    var targetModule = moduleMaps[name];  // 从 moduleMaps 取出模块.
    
    // 如果目标模块没有实体属性则建立.
    // 将模块函数绑定至此属性作为缓存用途, 避免多次 require 时重复执行初始化.
    if (!targetModule.entity) {
        
        var initFuncArgs = [];  // 模块初始化函数 apply 方法绑定参数数组. 此数组中的参数为模块依赖中的模块函数.
        
        // 循环此模块的依赖属性, 取出这些依赖模块. 如果没有依赖则循环不执行.
        for (var i = 0, length = targetModule.dependencies.length; i < length; i++) {
            // 如果依赖模块也有 entity 属性则直接取出.
            if (moduleMaps[targetModule.dependencies[i].entity]) {
                initFuncArgs.push(moduleMaps[targetModule.dependencies[i]].entity);
            } else {
                initFuncArgs.push(moduleRequire(targetModule.dependencies[i]));  // 否则递归进行建立.
            }
        }
        
        // 设置模块的 entity 属性.
        targetModule.entity = targetModule.initFunc.apply(null, initFuncArgs);
        
    }
    
    return targetModule.entity;  // 返回模块 entity 属性而非本身.
};
},{}]},{},[1])
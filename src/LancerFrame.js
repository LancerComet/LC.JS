// Lancer Frame V0.0.1 By LancerComet at 16:44, 2016.02.29.
// # Carry Your World #

(function (root, undefined) {
    "use strict";

    var LancerFrame = function () {

    };
    
    // Definition: 常量定义区.
    // =================================
    LancerFrame.VERSION = "0.0.1";
    LancerFrame.AUTHOR = "LancerComet";
    
    
    // Definition: 静态方法定义区.
    // =================================    
    LancerFrame.define = require("./module-func/module-func").define;  // 模块定义方法.
    LancerFrame.require = require("./module-func/module-func").require;  // 模块引用方法.
    
    
    root.LancerFrame = root.lc = LancerFrame;



    var parseElement = require("./parse-element/parse-element");
    parseElement(document.getElementById("test"), "Person");

})(window);
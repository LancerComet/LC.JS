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
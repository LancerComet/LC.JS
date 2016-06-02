// Lancer Frame V0.0.1 By LancerComet at 16:44, 2016.02.29.
// # Carry Your World #

(function (root, undefined) {
    "use strict";
    var startTime = performance.now();
    console.log("StartTime: " + startTime);

    var LancerFrame = {};
    
    // Definition: 常量定义区.
    // =================================
    LancerFrame.VERSION = "0.0.1";
    LancerFrame.AUTHOR = "LancerComet";
    LancerFrame.BROWSER = require("./init/browser-detective")();
    
    
    // Definition: 静态方法定义区.
    // =================================    
    LancerFrame.controller = require("./module-func/controller").controller;  // 控制器定义方法.
    LancerFrame.domFuncs = {
        findChildrenByAttr: require("./static-func/find-children-by-attr")  // 使用属性扫描后代元素方法.
    };
    
    // Definition: 框架初始化.
    // =================================
    // 让框架在 DomContentLoaded 时进行初始化.
    // 如果没赶上, 则在 window.onload 时进行.
    // 如果还没赶上, 检测 document.readyState 是否为 complete, 是则直接执行.
    (function () {
        LancerFrame.inited = false;
        LancerFrame.init = require("./init/init");
        window.addEventListener("DOMContentLoaded", function () {
            console.log("Init at DOMContentLoaded");
            LancerFrame.init(LancerFrame);
            var endTime = performance.now();
            console.log("EndTime: " + endTime);
            console.log("Init takes " + (endTime - startTime));
        });
        window.addEventListener("load", function () {
            if (LancerFrame.inited) return;
            LancerFrame.init(LancerFrame);
        });
        setTimeout(function () {
            if (LancerFrame.inited) return;
            document.readyState === "complete" && LancerFrame.init(LancerFrame);
        }, 1);
    })();



    // Definition: 将 LancerFrame 挂载至全局环境.
    // =================================
    root.LancerFrame = root.$lc = LancerFrame;


})(window);
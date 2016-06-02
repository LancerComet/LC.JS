// Lancer Frame V0.0.1 By LancerComet at 16:44, 2016.02.29.
// # Carry Your World #

import {initFunc} from "./LancerFrame-init.js"

(function (root, undefined) {
    "use strict";
    
    var $lc = {};
    
    // Definition: 常量定义区.
    // =================================
    $lc.VERSION = "0.0.1";
    $lc.AUTHOR = "LancerComet";
    $lc.BROWSER = "";  // TODO: 检测浏览器.
    
    
    // Definition: 静态方法定义区.
    // =================================    
    
    
    
    // Definition: 框架初始化.
    // =================================
    // 让框架在 DomContentLoaded 时进行初始化.
    // 如果没赶上, 则在 window.onload 时进行.
    // 如果还没赶上, 检测 document.readyState 是否为 complete, 是则直接执行.
    (function () {
        $lc.inited = false;
        
        window.addEventListener("DOMContentLoaded", function () {
            console.log("Init at DOMContentLoaded");
            initFunc(LancerFrame);
        });
        
        window.addEventListener("load", function () {
            if ($lc.inited) return;
            initFunc(LancerFrame);
        });
        
        setTimeout(function () {
            if ($lc.inited) return;
            document.readyState === "complete" && initFunc(LancerFrame);
        }, 1);
        
    })();



    // Definition: 将 LancerFrame 挂载至全局环境.
    // =================================
    root.LancerFrame = root.$lc = $lc;


})(window);
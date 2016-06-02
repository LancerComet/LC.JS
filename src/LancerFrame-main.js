// Lancer Frame V0.0.1 By LancerComet at 16:44, 2016.02.29.
// # Carry Your World #

import {setStaticFunc} from "./static-func/_main"  
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
    setStaticFunc($lc);  // 设置静态方法.
    
    
    
    // Definition: 框架初始化.
    // =================================
    // 让框架在 DomContentLoaded 时进行初始化.
    // 如果没赶上, 则在 window.onload 时进行.
    // 如果还没赶上, 检测 document.readyState 是否为 complete, 是则直接执行.
    (() => {
        $lc.inited = false;
        
        $lc.on(window, "DOMContentLoaded", () => {
            if ($lc.inited) return;
            console.log("Init at DOMContentLoaded");
            initFunc($lc);
            $lc.inited = true;            
        });
        
        $lc.on(window, "load", () => {
            if ($lc.inited) return;
            console.log("Init at window.onload");
            initFunc($lc);
            $lc.inited = true;            
        });
        
        setTimeout(() => {
            document.readyState === "complete" && (() => {
                if ($lc.inited) return;        
                console.log("Init at readyState = complete")        
                initFunc($lc);
                $lc.inited = true;
            })();
        }, 1);
        
    })();



    // Definition: 将 LancerFrame 挂载至全局环境.
    // =================================
    root.LancerFrame = root.$lc = $lc;


})(window);
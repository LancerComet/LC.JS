// Lancer Frame V0.0.1 By LancerComet at 16:44, 2016.02.29.
// # Carry Your World #

import {_} from "./_/_"

import {setStaticFunc} from "./static-func/_main"

import {controller} from "./controller/controller"
import {directive} from "./directives/directive"
import {service} from "./service/service"
import {component} from "./component/component"

import {internalDirectives} from "./directives/internal-directives"
import {internalSerivces} from "./service/internal-service"
import {domInit} from "./dom-init/_main"

(function (root, undefined) {
    "use strict";
    
    var $lc = {};
    
    // Definition: 常量定义区.
    // =================================
    $lc.VERSION = "0.0.1";
    $lc.AUTHOR = "LancerComet";
    $lc.BROWSER = _.browser();


    // Definition: 初始化框架模块.
    // =================================
    setStaticFunc($lc);  // 初始化静态方法.
    controller($lc);  // 初始化控制器逻辑.
    directive($lc);  // 初始化指令定义函数.
    service($lc);  // 初始化服务函数.
    component($lc);  // 初始化组件函数.


    // Definition: 框架初始化.
    // =================================
    // 让框架在 DomContentLoaded 时进行初始化.
    // 如果没赶上, 则在 window.onload 时进行.
    // 如果还没赶上, 检测 document.readyState 是否为 complete, 是则直接执行.
    (() => {
        $lc.inited = false;
        
        $lc.on(window, "DOMContentLoaded", () => {
            if ($lc.inited) return;
            initAfterDomReady();
            $lc.inited = true;
        });
        
        $lc.on(window, "load", () => {
            if ($lc.inited) return;
            initAfterDomReady();
            $lc.inited = true;
        });
        
        setTimeout(() => {
            document.readyState === "complete" && (() => {
                if ($lc.inited) return;
                initAfterDomReady();
                $lc.inited = true;
            })();
        }, 1);
        
    })();


    // Definition: 将 LancerFrame 挂载至全局环境.
    // =================================
    root.LancerFrame = root.$lc = $lc;


    /* Definiton goes below. */


    // Definiiton: 框架初始化函数.
    // =================================
    function initAfterDomReady () {
        internalDirectives($lc);  // 初始化内置指令.
        internalSerivces($lc);  // 初始化内置服务.
        domInit($lc);  // 扫描文档结构.
    }


})(window);
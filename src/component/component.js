/*
 *  LancerFrame Component Function By LancerComet at 21:10, 2016.06.10.
 *  # Carry Your World #
 *  ---
 *  $lc.component.
 */

import {_} from "../_/_"

export function component ($lc) {

    $lc.components = {};  // 存储定义组件.

    $lc.component = function (componentName, options) {

        /*
         *  @ options: {
         *      $init: Function,
         *      $done: Function,
         *      $destroy: Function
         *  }
         */

        if (options.$init && _.typeof(options.$init) !== "function") {
            errorHandler("$init");
            return false;
        }

        if (options.$done && _.typeof(options.$done) !== "function") {
            errorHandler("$done");
            return false;
        }

        if (options.$destroy && _.typeof(options.$destroy) !== "function") {
            errorHandler("$destroy");
            return false;
        }

        $lc.components[componentName] = class {
            constructor () {
                this.$name = componentName;
                this.$template = options.$template || "";

                this.$init = (element, scope) => {

                    // 处理绑定.
                    // :class 与 :text.
                    console.log(_.getAttrs(element))

                    options.$init && options.$init(element, scope);
                };

                this.$done = (element, scope) => {
                    options.$done && options.$done(element, scope);
                };

                this.$destroy = destoryFunc;
            }
        };

    };

    function destoryFunc () {
        console.log("Destory Func.")
    }
    
    function errorHandler (type) {
        $lc.log.error(`定义组件时定义的 ${type} 必须为 Function 类型.`);
    }
}
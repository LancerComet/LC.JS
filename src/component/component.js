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
         *      $destroy: Function,
         *      $transparent: Boolean
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
                this.$transparent = options.$transparent;

                this.$init = (element, scope) => {
                    // 处理绑定. 暂时只有 :text 与 :class.
                    var attrs = _.getAttrs(element);

                    // :class.
                    var templateClass = this.$template.match(/class=["|']\S*["|']/);
                    if (templateClass && attrs[":class"]) {
                        templateClass = _.strip(templateClass[0].trim(), "\"");
                        templateClass = templateClass.substr(templateClass.indexOf("=") + 1);
                        this.$template = this.$template.replace(templateClass, templateClass + ` ${attrs[":class"]}`);
                    }


                    // :text.
                    if (attrs[":text"]) {
                        attrs[":text"] = attrs[":text"].replace(/"/g, "'");

                        var text = attrs[":text"];
                        if (text.indexOf("'") < 0) {
                            // 指令.
                            this.$template = this.$template.replace(/><\//, ` lc-text="${text}"></`);
                        } else {
                            // 字符串.
                            this.$template = this.$template.replace(/><\//, `>${text.replace(/'/g, "")}</`);
                        }

                    }

                    options.$init && options.$init(element, scope);
                };

                this.$done = (element, scope) => {
                    options.$done && options.$done(element, scope);
                };

                this.$destroy = destoryFunc;
            }
        }
    };

    function destoryFunc () {
        console.log("Destory Func.")
    }
    
    function errorHandler (type) {
        $lc.log.error(`定义组件时定义的 ${type} 必须为 Function 类型.`);
    }
}
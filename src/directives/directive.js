// Lancer Frame V0.0.1 By LancerComet at 12:09, 2016.06.02.
// # Carry Your World #
// ---
// 指令定义方法.
// 本方法用于定义指令.

import {_} from "../_/_"

export { directive }

function directive ($lc) {
    $lc.directives = {};

    // 定义指令存储数组.
    $lc.directive = function (name, options) {

        /*
         * @ name: String,
         * @ options: {
         *       $init: function (element, scope),  // 指令初始化时执行.
         *       $done: Function,  // 指令初始化完毕后执行.
         *       $update: Function,  // 指令节点进行更新时执行.
         *       $destory: Function  // 指令在销毁时执行.
         *   }
         */

        if (_.typeof(name) !== "string") {
            throw new Error(`自定义指令时必须使用字符串作为指令名称.`);
        }


        // 将指令登记到 $lc.directives 中.
        // 登记过的指令是一个 Class, 用于在节点初始化的时候生成指令对象并存储到控制器的 scope.$directives 中.
        // 这样就可以不依赖 HTML 上的属性了.
        $lc.directives["lc-" + name] = class {
            constructor (element, scope) {
                this.$element = element;
                this.$scope = scope;
                this.$directiveName = `lc-${name}`;
                this.$expr = this.$element.attributes[this.$directiveName].value;

                options.$init && options.$init.call(this, this.$element, this.scope);

                // 处理多态.(如果 options 传来指定方法)
                if (options.$done) {
                    var _$done = this.$done;
                    _$done.call(this);
                    options.$done.call(this);  // 执行自定义 $done.
                } else {
                    this.$done.call(this);
                }

                if (options.$update) {
                    var _$update = this.$update;
                    this.$update = function () {
                        _$update.call(this);
                        options.$update.apply(this, arguments);
                    };
                }

                if (options.$destory) {
                    var _$destory = this.$destory;
                    this.$destory = function () {
                        _$destory.call(this);
                        options.$destory.apply(this, arguments);
                    };
                }

                this.$removeDirective();
            }

            $done () {
                // 好像没碉用？
            }

            $update () {
            }

            $destory () {

            }

            // 删除节点指令标识.
            $removeDirective () {
                this.$element.removeAttribute(this.$directiveName);
            }

        };

        // 设置优先级.
        // 优先级为 10000 的指令仅仅初始化其自身, 无视其他指令.
        $lc.directives["lc-" + name].priority = options.priority || 1;

    }

}



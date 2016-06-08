/*
 *  LancerFrame Internal Directives by LancerComet at 10:39, 2016/6/3.
 *  # Carry Your World #
 *  ---
 *  内置指令定义.
 */
import {_} from "../_/_"
export {internalDirectives}

function internalDirectives ($lc, undefined) {

    // lc-skip
    $lc.directive("skip", {
        priority: 10000
    });

    // lc-cloak
    $lc.directive("cloak", {
        priority: 0,
        $done: function () {
            this.$element.removeAttribute(this.$directiveName);
        }
    });

    // lc-text
    (() => {
        $lc.directive("text", {
            $init: function () {
                setInnterText.call(this);
            },
            $update: function (newValue) {
                setInnterText.call(this, newValue);
            }
        });

        function setInnterText (value) {
            if (value === undefined) {
                value = this.$scope[this.$expr] || "";
            }
            if (this.$element.textContent !== undefined) {
                this.$element.textContent = value;
            } else {
                this.$element.innerText = value;
            }
        }
    })();

    // lc-html
    (() => {
        $lc.directive("html", {
            $done: func,
            $update: func
        });

        function func (value) {
            if (_.typeof(value) === "undefined") value = "";
            this.$element.innerHTML = value;
        }
    })();

    // lc-model
    $lc.directive("model", {
        $init: function () {
            var self = this,
                element = this.$element,
                scope = this.$scope,
                imeIgnored = false;

            this.duplexIgnored = false;  // 当用户处于输入状态时无视双向绑定.

            // 进入输入法输入状态时锁定控制标识.
            $lc.on(element, "compositionstart", function () {
                imeIgnored = true;
            });

            // 当输入法状态恢复时释放控制标识.
            $lc.on(element, "compositionend", function () {
                imeIgnored = false;
            });

            // 进入激活状态时无视双向绑定.
            $lc.on(element, "focus", () => this.duplexIgnored = true);

            $lc.on(element, "blur", () => this.duplexIgnored = false);


            element.addEventListener("input", inputEvent, false);

            // Fixing: IE9 在 Backspace / Delete / 剪切时不触发 input 事件.
            // http://frontenddev.org/article/compatible-with-processing-and-chinese-input-method-to-optimize-the-input-events.html
            if ($lc.BROWSER === "IE 9") {

                $lc.on(element, "cut", () => setTimeout(inputEvent, 1));  // 必须放置在任务队列中才生效.

                $lc.on(element, "keyup", (event) => {
                    event = event || window.event;
                    (event.keyCode === 46 || event.keyCode === 8) && inputEvent();
                });

            }

            function inputEvent () {
                if (imeIgnored) { return; }
                scope[self.$expr] = element.value;
            }

        },

        $update: function (newValue) {
            if (this.duplexIgnored) return;
            this.$element.value = newValue;
        },

        $done: function () {
            this.$element.value = this.$scope[this.$expr];
        }

    });

    // lc-mouse events.
    (() => {
        $lc.directive("mouseenter", {
            $done: function () {
                $lc.on(this.$element, "mouseenter", this.$scope[this.$expr]);
            },

            $update: function (newFunc) {

            }
        });

        $lc.directive("mouseleave", {
            $done: function () {
                $lc.on(this.$element, "mouseleave", this.$scope[this.$expr]);
            },

            $update: function () {

            }
        });

        $lc.directive("mouseover", {
            $done: function () {
                $lc.on(this.$element, "mouseover", this.$scope[this.$expr]);
            },

            $update: function () {

            }
        });

        $lc.directive("mouseout", {
            $done: function () {
                $lc.on(this.$element, "mouseout", this.$scope[this.$expr]);
            },

            $update: function () {

            }
        });
    })();

    // lc-click
    $lc.directive("click", {
        $init: function () {
            // 处理事件委托属性.
            if (this.$expr.indexOf("|") > -1) {
                this.$delegatedElement = _.findFilter(this.$expr);
                this.$expr = _.removeFilter(this.$expr);
                this.$targets = this.$element.querySelectorAll(this.$delegatedElement);
            }
        },
        $done: function () {
            const self = this;

            // 事件委托.
            if (this.$delegatedElement) {

                this.$clickEvent = function (event) {
                    event = window.event || event;
                    var target = event.target || event.srcElement;

                    // 判断 target 是不是想要的元素并返回结果.
                    var targetThis = targetChecking.call(self, target);

                    if (target === self.$element || targetThis === false) return;  // 如果点击到了委托容器 || 循环到了委托容器则退出.
                    self.$scope[self.$expr].apply(targetThis, arguments);
                    // console.log(`time takes ${end - start}`);  // 十五层节点嵌套大概需要 0.2 秒.
                };

            // 无委托.
            } else {
                this.$clickEvent = function () { self.$scope[self.$expr].apply(this, arguments); };
            }

            $lc.on(this.$element, "click", this.$clickEvent);
        },

        $update: function (newValue) {
            $lc.off(this.$element, "click", this.$clickEvent);
            const self = this;

            // 事件委托.
            if (this.$delegatedElement) {

                this.$clickEvent = function (event) {
                    event = window.event || event;
                    var target = event.target || event.srcElement;

                    // 判断 target 是不是想要的元素并返回结果.
                    var targetThis = targetChecking.call(self, target);

                    if (target === self.$element || targetThis === false) return;  // 如果点击到了委托容器则退出.
                    newValue.apply(targetThis, arguments);
                };

            // 无委托.
            } else {
                this.$clickEvent = function () { newValue.apply(this, arguments); };
            }

            $lc.on(this.$element, "click", this.$clickEvent);
        }
    });


}

// 判断点击事件是否为需要的元素.
function targetChecking (target) {
    if (target === this.$element) return false;  // 如果递归到 lc-click 指令元素本身则退出.
    var found = false;
    for (let i = 0, length = this.$targets.length; i < length; i++) {
        if (target !== this.$targets[i]) continue;
        found = true;
        return target;
    }
    if (!found) return targetChecking.call(this, target.parentNode);
}

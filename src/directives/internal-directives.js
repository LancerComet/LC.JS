/*
 *  LancerFrame Internal Directives by LancerComet at 10:39, 2016/6/3.
 *  # Carry Your World #
 *  ---
 *  内置指令定义.
 */

export {internalDirectives}

function internalDirectives ($lc) {

    // lc-text
    $lc.directive("text", {
        $done: function () {
            this.$element.innerText = this.$scope[this.$expr];
        },
        $update: function (newValue) {
            this.$element.innerText = newValue;
        }
    });

    // lc-html
    (() => {
        $lc.directive("html", {
            $done: func,
            $update: func
        });

        function func (value) {
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
        $done: function () {
            this.$clickEvent = this.$scope[this.$expr];
            $lc.on(this.$element, "click", this.$clickEvent);
        },

        $update: function (newValue) {
            $lc.off(this.$element, "click", this.$clickEvent);
            this.$clickEvent = newValue;
            $lc.on(this.$element, "click", this.$clickEvent);
        }
    });


}

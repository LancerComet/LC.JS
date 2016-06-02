/*
 *  LancerFrame Model directive By LancerComet at 15:10, 2016.03.05.
 *  Last edit at 22:56, 2016.06.02.
 *  # Carry Your World #
 *  ---
 *  lc-model 指令模块.
 */

export {lcModel}

function lcModel ($lc) {
    
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
            })
            
            // 当输入法状态恢复时释放控制标识.
            $lc.on(element, "compositionend", function () {
                imeIgnored = false;
            });
            
            // 进入激活状态时无视双向绑定.
            $lc.on(element, "focus", function () {
                self.duplexIgnored = true;
            });
            
            $lc.on(element, "blur", function () {
                self.duplexIgnored = false;
            });
            
            
            element.addEventListener("input", inputEvent, false);
            
            // Fixing: IE9 在 Backspace / Delete / 剪切时不触发 input 事件.
            // http://frontenddev.org/article/compatible-with-processing-and-chinese-input-method-to-optimize-the-input-events.html
            if ($lc.BROWSER === "IE 9") {
                
                $lc.on(element, "cut", function () {
                    setTimeout(inputEvent, 1);  // 必须放置在任务队列中才生效.                    
                });
                
                $lc.on(element, "keyup", function (event) {
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
    
}
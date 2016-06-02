/*
 *  LancerFrame Click directive By LancerComet at 15:10, 2016.03.05.
 *  Last edit at 01:33, 2016.06.03.
 *  # Carry Your World #
 *  ---
 *  lc-click 指令模块.
 */

export {lcClick}

function lcClick ($lc) {
    
    $lc.directive("click", {
        $done: function () {
            $lc.on(this.$element, "click", this.$scope[this.$expr]);
        },
        
        $update: function () {
            
        }
    });
}

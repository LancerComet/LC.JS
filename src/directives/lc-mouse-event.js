/*
 *  LancerFrame Mouse Event directive By LancerComet at 01:44, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-mouse 指令模块.
 */

export {lcMouseEvents}

function lcMouseEvents ($lc) {
    
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
    
}
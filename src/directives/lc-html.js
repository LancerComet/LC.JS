// Lancer Frame V0.0.1 By LancerComet at 16:27, 2016.06.02.
// # Carry Your World #
// ---
// lc-html.

export {lcHTML}

function lcHTML ($lc) {
    
    $lc.directive("html", {
        $done: func,
        $update: func
    });
    
    function func (value) {
        this.$element.innerHTML = value;        
    }
    
}
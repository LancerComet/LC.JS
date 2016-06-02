// Lancer Frame V0.0.1 By LancerComet at 18:44, 2016.06.02.
// # Carry Your World #
// ---
// lc-text.

export {lcHTML}

function lcHTML ($lc) {
    
    $lc.directive("text", {
        $init: function (element, initValue) {
            element.innerText = initValue;
        },
        $update: function (element, newValue) {
            element.innerText = newValue;
        }
    });
    
}
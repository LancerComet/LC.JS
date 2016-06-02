// Lancer Frame V0.0.1 By LancerComet at 16:33, 2016.06.02.
// # Carry Your World #
// ---
// lc-model.

export {lcModel}

function lcModel ($lc) {
    
    $lc.directive("model", {
        $init: function (element, initValue) {
            element.value = initValue;            
        },
        $update: function (element, newValue) {
            element.value = newValue;
        },
        $done: function () {
            
        }
    });
    
}
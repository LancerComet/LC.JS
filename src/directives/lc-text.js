// Lancer Frame V0.0.1 By LancerComet at 18:44, 2016.06.02.
// # Carry Your World #
// ---
// lc-text.

export {lcText}

function lcText ($lc) {
    
    $lc.directive("text", {
        $done: function () {
            this.$element.innerText = this.$scope[this.$expr];
        },
        $update: function (newValue) {
            console.log("lc-text on $update: newValue = " + newValue)
            this.$element.innerText = newValue;
        }
    });
    
}
// Lancer Frame V0.0.1 By LancerComet at 22:16, 2016.06.02.
// # Carry Your World #
// ---
// CSS 设置方法
export function css ($lc) {
    
    $lc.css = function (element, prop, value) {
        if (element.style.prop === undefined) return;
        element.style.prop = value;
    }   
    
};
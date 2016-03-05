/*
 *  LancerFrame Click directive By LancerComet at 2:11, 2016.03.06.
 *  # Carry Your World #
 *  ---
 *  lc-click 指令模块.
 */

module.exports = function bindLcClick (elements, scopeObj) {
    for (var i = 0, length = elements.length; i < length; i++) {
        var element = elements[i];
        
        if (!element.attributes["lc-click"]) {
            element.children.length && bindLcClick(element.children, scopeObj);
            continue; 
        }
        
        var clickEvent = scopeObj[element.attributes["lc-click"].value];
        element.addEventListener("click", clickEvent, false);
        
    }
}
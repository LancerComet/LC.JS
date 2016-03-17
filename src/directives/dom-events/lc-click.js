/*
 *  LancerFrame Click directive By LancerComet at 2:11, 2016.03.06.
 *  # Carry Your World #
 *  ---
 *  lc-click 指令模块.
 */

var directiveName = "lc-click";

module.exports = {
    init: initLcClick
};

function initLcClick (elements, scopeObj) {
    for (var i = 0, length = elements.length; i < length; i++) {
        var element = elements[i];

        if (!element.attributes[directiveName]) {
            element.children.length && initLcClick(element.children, scopeObj);
            continue;
        }

        var clickEvent = scopeObj[element.attributes[directiveName].value];
        element.addEventListener("click", clickEvent, false);

    }
}
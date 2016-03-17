/*
 *  LancerFrame MouseEnter directive By LancerComet at 17:17, 2016.03.17.
 *  # Carry Your World #
 *  ---
 *  lc-mouseenter 指令模块.
 */

var directiveName = "lc-mouseenter";

module.exports = {
    init: initLcMouseEnter
};

function initLcMouseEnter (elements, scopeObj) {
    for (var i = 0, length = elements.length; i < length; i++) {
        var element = elements[i];

        if (!element.attributes[directiveName]) {
            element.children.length && initLcMouseEnter(element.children, scopeObj);
            continue;
        }

        var event = scopeObj[element.attributes[directiveName].value];
        element.addEventListener("mouseenter", event, false);

    }
}
/*
 *  LancerFrame MouseLeave directive By LancerComet at 17:17, 2016.03.17.
 *  # Carry Your World #
 *  ---
 *  lc-mouseleave 指令模块.
 */

var directiveName = "lc-mouseleave";

module.exports = {
    init: initLcMouseLeave
};

function initLcMouseLeave (elements, scopeObj) {
    for (var i = 0, length = elements.length; i < length; i++) {
        var element = elements[i];

        if (!element.attributes[directiveName]) {
            element.children.length && initLcMouseLeave(element.children, scopeObj);
            continue;
        }

        var event = scopeObj[element.attributes[directiveName].value];
        element.addEventListener("mouseleave", event, false);

    }
}
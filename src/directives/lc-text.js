/*
 *  LancerFrame Text directive By LancerComet at 15:03, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-text 指令模块.
 */

var directiveName = "lc-text";

// lc-text 指令初始化函数(绑定数值).
module.exports = {
    init: initLcText,
    syncData: setData
};

function initLcText (children, scopeObj) {
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];

        if (!child.attributes[directiveName]) {
            child.children.length > 0 && initLcText(child.children, scopeObj);
            continue;
        }

        setData(child, scopeObj[child.attributes[directiveName].value]);

        // lc-text 不允许有子元素所以不进行子元素递归.
    }
}

function setData (element, value) {
    element.innerText = value;
}
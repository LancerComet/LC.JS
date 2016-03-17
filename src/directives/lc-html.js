/*
 *  LancerFrame HTML directive By LancerComet at 12:13, 2016.03.17.
 *  # Carry Your World #
 *  ---
 *  lc-html 指令模块.
 */
var directiveName = "lc-html";

// lc-html 指令初始化函数(绑定数值).
module.exports = {
    init: initLcHTML,
    syncData: setData
};

function initLcHTML (children, scopeObj) {
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];

        if (!child.attributes[directiveName]) {
            child.children.length > 0 && initLcHTML(child.children, scopeObj);
            continue;
        }

        setData(child, scopeObj[child.attributes[directiveName].value]);
        // lc-html 不允许有子元素所以不进行子元素递归.
    }
}

function setData (element, value) {
    element.innerHTML = value;
}
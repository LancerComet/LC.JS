/*
 *  LC-CSS Directive By LancerComet at 10:38, 2016/3/18.
 *  # Carry Your World #
 *  ---
 *  lc-css directive.
 */

module.exports = {
    init: initLcCSS,
    setCSS: setCSS
};

var directivePriefx = "lc-css";

// Definition: 指令初始化函数.
function initLcCSS (children, scopeObj) {
    // @ children: 控制器下的后代元素.
    // @ scopeObj: 控制器的 scope 对象.

    for (var i = 0, length = children.length; i < length; i++) {
        setCSS(children[i], null, null, scopeObj);
    }

}

// Definition: 双向数据绑定的样式同步函数.
function setCSS (element, key, value, scopeObj) {
    for (var i = 0, length = element.attributes.length; i < length; i++) {
        var attr = element.attributes[i];  // 遍历的当前属性.
        var attrName = attr.name;  // 属性名称: "lc-css-XXX" || 其他.

        if (attrName.indexOf(directivePriefx) < 0 || (key && attr.value !== key)) { continue; }  // 如果不是 "lc-css" 则继续循环.

        // 如果传来 scopeObj 则为初始化阶段调取.
        if (scopeObj) {
            value = scopeObj[attr.value];
        }

        var propName = attrName.substr(directivePriefx.length + 1);  // "从 lc-css-XXX" 获取 "XXX".
        cssModify(element, propName, value);  // 操作 CSS.
    }
}

// Definition: CSS 操作方法.
function cssModify (element, cssProp, value) {
    element.style[cssProp] = value;
}
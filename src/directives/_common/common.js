/*
 *  LancerFrame directive common functions By LancerComet at 15:11, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  指令模块通用函数文件.
 */

module.exports = {
    syncData: syncDataInSetter
};

var lcText = require('../data-bind/lc-text'),
    lcHtml = require('../data-bind/lc-html'),
    lcModel = require('../data-bind/lc-model'),
    lcCSS = require("../style-edit/lc-css");


// Definition: 数据绑定函数.
// 将在 getter / setter 中调用以进行如 lc-model、lc-text 等指令的数据同步.
function syncDataInSetter (ctrlDom, key, newValue) {

    // 循环控制器节点.
    for (var i = 0, length = ctrlDom.length; i < length; i++) {

        // 在每个控制器节点中初始化各指令.
        (function bindData(children) {  // children 为每个控制器节点下的后代元素.
            for (var i = 0, length = children.length; i < length; i++) {
                var child = children[i];

                // 如果没有这些修改 innerHTML 的指令.
                if (!child.attributes["lc-text"] && !child.attributes["lc-model"] && !child.attributes["lc-html"]) {
                    child.children.length > 0 && bindData(child.children);
                } else {
                    // 会修改 innerHTML 的指令.
                    // 开始进行数据绑定.
                    (child.attributes["lc-text"] && child.attributes["lc-text"].value === key) && lcText.syncData(child, newValue);
                    (child.attributes["lc-model"] && child.attributes["lc-model"].value === key) && lcModel.syncData(child, newValue);
                    (child.attributes["lc-html"] && child.attributes["lc-html"].value === key) && lcHtml.syncData(child, newValue);
                }

                lcCSS.setCSS(child, key, newValue);  // lc-css 的过滤将在函数内部进行.
            }
        })(ctrlDom[i].children);

    }

}
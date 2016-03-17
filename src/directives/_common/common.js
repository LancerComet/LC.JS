/*
 *  LancerFrame directive common functions By LancerComet at 15:11, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  指令模块通用函数文件.
 */

module.exports = {
    syncData: syncData
};

var lcText = require('../lc-text'),
    lcHtml = require('../lc-html'),
    lcModel = require('../lc-model');


// Definition: 数据绑定函数.
// 将在 getter / setter 中调用以进行如 lc-model、lc-text 等指令的数据同步.
function syncData (ctrlDom, key, newValue) {

    // 循环控制器节点.
    for (var i = 0, length = ctrlDom.length; i < length; i++) {

        // 在每个控制器节点中初始化各指令.
        (function bindData(children) {
            for (var i = 0, length = children.length; i < length; i++) {
                var child = children[i];

                if (!child.attributes["lc-text"] && !child.attributes["lc-model"] && !child.attributes["lc-html"]) {
                    child.children.length > 0 && bindData(child.children);
                    continue;
                }

                // 开始进行数据绑定.
                (child.attributes["lc-text"] && child.attributes["lc-text"].value === key) && lcText.syncData(child, newValue);
                (child.attributes["lc-model"] && child.attributes["lc-model"].value === key) && lcModel.syncData(child, newValue);
                (child.attributes["lc-html"] && child.attributes["lc-html"].value === key) && lcHtml.syncData(child, newValue);
            }
        })(ctrlDom[i].children);

    }

}

// Definition: children 节点扫描函数.
// 返回 Array.
function findChildren (parent, attr, value) {
    var children = parent.children;
    var result = [];

     for (var i = 0, length = children.length; i < length; i++) {
         var child = children[i];
         
         // 如果匹配到了 attr = value.
         console.log(child.attributes[attr] ? child.attributes[attr].value : "no this attr")
         if (child.attributes[attr] && child.attributes[attr].value === value) {
             result.push(child);
         }
         
         if (child.children.length) {
             result = result.concat(findChildren(child, attr, value));
         }
         
     }
     
     return result;     
}
/*
 *  LancerFrame directive common functions By LancerComet at 15:11, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  指令模块通用函数文件.
 */

module.exports = {
    syncData: syncData
};

// Definition: 数据绑定函数.
// 将在 getter / setter 中调用以进行如 lc-model、lc-text 等指令的数据同步.
function syncData (ctrlName, key, newValue) {
    var ctrlDom = document.querySelector("[lc-controller=" + ctrlName + "]");

    (function bindData(children) {

        for (var i = 0, length = children.length; i < length; i++) {
            var child = children[i];

            if (!child.attributes["lc-text"] && !child.attributes["lc-model"]) {
                child.children.length > 0 && bindData(child.children);
                continue;
            };
            
            if (child.attributes["lc-text"] && child.attributes["lc-text"].value === key) console.log(child)
            if (child.attributes["lc-model"] && child.attributes["lc-model"].value === key) console.log(child)
            
            if (child.attributes["lc-text"] && child.attributes["lc-text"].value === key) lcText(child, newValue);
            if (child.attributes["lc-model"] && child.attributes["lc-model"].value === key) lcModel(child, newValue);
        }

    })(ctrlDom.children);
    
    
    
    // TODO: 观察在函数中创建函数是否引起内存溢出问题.
    // 进行 lc-text 的数据绑定.
    function lcText (target, newValue) {
        target.innerText = newValue;
    }
    
    
    // 进行 lc-model 的数据绑定.
    function lcModel (target, newValue) {
        target.value = newValue;
    }

}

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
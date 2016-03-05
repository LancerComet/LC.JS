/*
 *  LancerFrame Model directive By LancerComet at 15:10, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-model 指令模块.
 */

// Definition: lc-model 指令绑定.
module.exports = function bindLcModel (children, scopeObj) {    
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];
        
        if (!child.attributes["lc-model"]) {
            child.children.length > 0 && bindLcModel(child.children, scopeObj);
            continue;
        }
            
        var keyName = child.attributes["lc-model"].value;
        child.value = scopeObj[keyName] ? scopeObj[keyName] : "";
        
        // OnInput 时候进行双向数据绑定.
        child.addEventListener("input", function (event) {
            var target = event.target || event.srcElement;
            console.log(scopeObj);
            console.log(keyName)
            scopeObj[keyName] = target.value;
        }, false);  

    }
};
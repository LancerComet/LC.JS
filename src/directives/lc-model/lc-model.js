/*
 *  LancerFrame Model directive By LancerComet at 15:10, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-model 指令模块.
 */

module.exports = {
    bindLcModel: bindLcModel
};

// Definition: lc-model 指令绑定.
function bindLcModel (children, ctrlData) {    
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];
        
        if (!child.attributes["lc-model"]) {
            child.children.length > 0 && bindLcModel(child.children, ctrlData);
            continue;
        }
            
        var keyName = child.attributes["lc-model"].value;
        child.value = ctrlData[keyName] ? ctrlData[keyName] : "";
        
        // OnInput 时候进行双向数据绑定.
        child.addEventListener("input", function (event) {
            var target = event.target || event.srcElement;
            console.log(ctrlData);
            console.log(keyName)
            ctrlData[keyName] = target.value;
        }, false);  
  

    }
}

/*
 *  LancerFrame Text directive By LancerComet at 15:03, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-text 指令模块.
 */

module.exports = {
    bindLcText: bindLcText  // lc-text 指令初始化函数(绑定数值).
};

function bindLcText (children, ctrlData) {
    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];
        
        if (!child.attributes["lc-text"]) {
            child.children.length > 0 && bindLcText(child.children, ctrlData);
            continue;
        }
        
        var value = ctrlData[child.attributes["lc-text"].value];
        child.innerText = value;
        
        // lc-text 不允许有子元素所以不进行子元素递归.
    }
}
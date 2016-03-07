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
        // Windows 8 的 IE11 下存在输入法无法输入中文的问题, 这里使用 KeyUp 加清理计时器的方式进行.
        var ua = navigator.userAgent;
        var exp = /Windows NT 6.3.*.Trident\/7.0/;
        if (ua.match(exp)) {
            var inputTimeout = null;
            child.addEventListener("keydown", function (event) {
                clearTimeout(inputTimeout);
                inputTimeout = setTimeout(function () {
                    var target = event.target || event.srcElement;
                    scopeObj[keyName] = target.value;
                }, 200);
            });
        } else {
            child.addEventListener("input", function (event) {
                console.log(event)
                var target = event.target || event.srcElement;
                console.log(scopeObj);
                console.log(keyName)
                scopeObj[keyName] = target.value;
            }, false);
        }


    }
};
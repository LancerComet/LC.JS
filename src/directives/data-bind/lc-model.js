/*
 *  LancerFrame Model directive By LancerComet at 15:10, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  lc-model 指令模块.
 */

var directiveName = "lc-model";

module.exports = {
    init: initLcModel,
    syncData: setData
};

// Definition: lc-model 指令绑定（初始化）.
function initLcModel (children, scopeObj, LancerFrame) {

    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];

        if (!child.attributes[directiveName]) {
            child.children.length > 0 && initLcModel(child.children, scopeObj, LancerFrame);
            continue;
        }

        var keyName = child.attributes[directiveName].value;
        child.value = scopeObj[keyName] ? scopeObj[keyName] : "";

        (function (keyName, child) {
            var imeIgnored = false;  // 忽略输入法状态控制标识.

            // 进入输入法输入状态时锁定控制标识.
            child.addEventListener("compositionstart", function () {
                imeIgnored = true;
            });

            // 当输入法状态恢复时释放控制标识.
            child.addEventListener("compositionend", function () {
                imeIgnored = false;
            });

            child.addEventListener("input", inputEvent, false);

            // Fixing: IE9 在 Backspace / Delete / 剪切时不触发 input 事件.
            // http://frontenddev.org/article/compatible-with-processing-and-chinese-input-method-to-optimize-the-input-events.html
            if (LancerFrame.BROWSER === "IE 9") {
                child.addEventListener("cut", function () {
                    console.log("cut event");
                    setTimeout(inputEvent, 1);  // 必须放置在任务队列中才生效.
                });

                child.addEventListener("keyup", function (event) {
                    console.log("keyup event");
                    event = event || window.event;
                    (event.keyCode === 46 || event.keyCode === 8) && inputEvent();
                });
            }

            // IE 下使用 KeyUp 进行数据绑定来避免输入法无效问题.
            if (LancerFrame.BROWSER.indexOf("IE") > -1) {
                child.addEventListener("keyup", function (event) {
                    console.log("keyup event");
                    event = event || window.event;
                    if (event.keyCode === 17 || event.keyCode === 18 || event.ctrlKey || event.shiftKey || event.altKey) { return; }
                    inputEvent();
                });
            }

            function inputEvent () {
                if (imeIgnored) { return; }
                scopeObj[keyName] = child.value;
            }

        })(keyName, child);

    }
}

// Definition: lc-model 双向数据绑定 set 中执行函数.
function setData (element, value) {
    element.value = value;
}
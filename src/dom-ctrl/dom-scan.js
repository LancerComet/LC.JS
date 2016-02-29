/*
 *  Document Scan Function By LancerComet at 18:43, 2016.01.17.
 *  # Carry Your World # 
 *  ---
 *  页面节点初始化模块.
 * 
 */

// Action: 获取框架属性列表.
var attrList = require("../app-config/attr-list").attrList;


// Definition: 本模块变量定义.
var allElements = document.querySelectorAll("*"); // 页面所有节点列表.
var lcControllers = [];  // 控制器节点列表.
var lcDoms = [];  // 框架节点列表.
 
// Definition: 扫描控制器节点.
function scanCtrlDoms() {

    // Action: 获取以 lc-controller 元素.
    for (let i = 0, length = allElements.length; i < length; i++) {
        // 如果获取到 lc-controller 属性, 则说明其为页面中的控制器节点, 将节点推送到控制器数组列表 lcControllers 中.
        allElements[i].getAttribute("lc-controller") && lcControllers.push(allElements[i]);
    }
        
    // Action: 扫描控制器节点.
    for (let i = 0, length = lcControllers.length; i < length; i++) {
        
        var domsInCtrl = getChildDoms(lcControllers[i]);  // 当前控制器下的所有元素.
        
        // 遍历所有子元素并检查其属性.
        for (let i = 0, length = domsInCtrl.length; i < length; i++) {
            var attrs = domsInCtrl[i].attributes;  // 当前子元素的所有属性.
            
            // 遍历当前子元素的所有属性.
            for (let index in attrs) {
                if (!attrs.hasOwnPorperty(index)) { return; }
                
                var attrName = attrs[index].name;  // 当前扫描的属性名称.
                var attrValue = attrs[index].value;  // 当前扫描的属性的值.
                
                // 循环属性列表查找是否包含框架属性.
                for (let i = 0, length = attrList.length; i < length; i++) {
                    
                    // 如果当前属性为框架属性则执行相应方法.
                    if (attrName.indexOf(attrList[i]) > -1) {  }
                    
                }
            
            }
            
        }
        
    }
    
}


// Definition: 获取所有后代元素.
function getChildDoms (dom) {
    
    // Definition: 后代元素列表数组.
    var childrenList = [];
    
    // 循环获取所有子元素.
    for (let i = 0, length = dom.children.length; i < length; i++) {
        var children = dom.children[i];  // 当前扫描的后代节点.
        childrenList.push(children);  // 将节点推送到数组.

        // 如果当前后代元素还有 children, 继续递归.
        if (children.children.length) {
            childrenList = childrenList.concat(getChildDoms(children));  // 拼接结果.
        }
        
    }
    
    return childrenList;
}

module.exports = scanCtrlDoms;
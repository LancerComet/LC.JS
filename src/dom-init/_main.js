// Lancer Frame V0.0.1 By LancerComet at 15:00, 2016.06.02.
// # Carry Your World #
// ---
// 节点初始化逻辑.

export {domInit}
 
// 开始初始化页面节点.
function domInit ($lc) {
    "use strict";
    
    // 初始化所有控制器节点.
    for (let controller in $lc.controllers) {
        (() => {
            var ctrl = controller;  // 创建闭包修复嵌套控制器初始化问题.
            var scope = $lc.controllers[ctrl];
            /*
            * @ scope: {
            *     $name: 控制器名称,
            *     $directives: 子节点指令对象, 用户数据同步.
            *     ... (其他用户定义属性)
            * } 
            */
            
            // 保存控制器节点.
            if (!scope.$ctrlDoms) {
                scope.$ctrlDoms = document.querySelectorAll(`[lc-controller=${scope.$name}]`);
            }
            
            // 创建控制器下的指令节点对象至数组 $directives 中.
            if (!scope.$directives) {
                scope.$directives = [];            
            }
            
            
            // 设置双向数据绑定.
            scope.$initFunc && (() => {         
                scope.$initFunc.apply(scope, [scope]);  // 将控制器对象放入 initFunc 中执行. 将加载用户属性.
                
                // 为每个用户定义的属性设置 get / set.
                for (let prop in scope) {
                    if (!scope.hasOwnProperty(prop) 
                        || prop === "$name" 
                        || prop === "$directives" 
                        || prop === "$initFunc"
                        || prop === "$ctrlDoms") { continue; }
                    
                    // 在自执行函数中创建闭包来保留每个属性的 key 与 value 的各自引用 propKey, propValue 以避免属性相互干扰.
                    (() => {
                        
                        var propKey = prop,
                            propValue = scope[prop];
                            
                        Object.defineProperty(scope, propKey, {
                            get: function () {
                                return propValue;
                            },
                            
                            set: function (newValue) {
                                console.log(`${scope.$name}.${propKey} 从 ${propValue} 修改为 ${newValue}`);
                                propValue = newValue;  // 用户修改值之后进行更新.
                                syncController(scope, propKey, propValue);  // 同步页面中所有此控制器节点中的数据.
                            }
                            
                        });
                        
                    })();
                    
                }
        
            })();
            
            // 初始化控制器节点与其子节点, 建立指令对象并推入 $directives.
            for (let i = 0, length = scope.$ctrlDoms.length; i < length; i++) {
                initController(scope.$ctrlDoms[i], scope);
                
                // 控制器节点处理完之后修改 lc-controller.
                scope.$ctrlDoms[i].setAttribute("lc-ctrl", scope.$name);
                scope.$ctrlDoms[i].removeAttribute("lc-controller");
            }
        })();
    }
    
    // Definition: 初始化控制器内的子节点指令.
    function initController (ctrlDom, scope) {
        
        (function initChilden (ctrlChildren) {
            
            for (let i = 0, length = ctrlChildren.length; i < length; i++) {
                var child = ctrlChildren[i];
                
                // 避开嵌套控制器.
                if (child.attributes["lc-controller"]) { return; }
                
                if (child.children.length > 0) {
                    initChilden(child.children);  // 多层嵌套子元素.
                } else {
                    // 获取节点上注册的指令.
                    for (let i = 0, length = child.attributes.length; i < length; i++) {
                        const direcitveName = child.attributes[i].name,  // 指令名称.
                                directiveExpr = child.attributes[i].value;  // 指令对应的 scope 属性.

                        if (direcitveName.indexOf("lc-") < 0) { continue; }

                        // 如果 $lc.directives 中有相应指令则初始化指令.
                        if ($lc.directives[direcitveName] && directiveExpr) {
                            scope.$directives.push(new $lc.directives[direcitveName](child, scope));
                        }
                        
                    }
                }
            }
            
        })(ctrlDom.children);
        
    }
    
    
    // Definition: 控制器数据同步函数.
    // 在 get / set 中调用.
    function syncController (scope, expr, newValue) {
        scope.$directives.forEach((directiveObj, index, $directives) => {
            if (directiveObj.$expr === expr) directiveObj.$update(newValue);
        });
    }
     
}
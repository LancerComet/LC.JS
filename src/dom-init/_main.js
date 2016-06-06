// Lancer Frame V0.0.1 By LancerComet at 15:00, 2016.06.02.
// # Carry Your World #
// ---
// 节点初始化逻辑.
import {$directivesDataSync} from "../controller/$directives-data-sync"
export {domInit}
 
// 开始初始化页面节点.
function domInit ($lc) {
    "use strict";
    
    // 初始化所有控制器节点.
    for (let controller in $lc.controllers) {
        if (!$lc.controllers.hasOwnProperty(controller)) continue;

        (() => {
            const ctrl = controller;  // 创建闭包修复嵌套控制器初始化问题.
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
            

            // 初始化控制器对象.
            // 设置双向数据绑定.
            scope.$initFunc && (() => {

                // 引入依赖控制器.
                var $dependencies = [];  // 依赖存放数组.
                if (scope.$dependencies) {
                    scope.$dependencies.forEach((dependency, index, dependencies) => {
                        $dependencies[index] = $lc.controllers[dependency] ?　$lc.controllers[dependency] : ($lc.services[dependency] ? $lc.services[dependency] : null);  // 控制器 > 服务 > null.
                    });
                }

                scope.$initFunc.apply(scope, [scope].concat($dependencies));  // 将控制器对象放入 initFunc 中执行. 将加载用户属性.
                
                // 为每个用户定义的属性设置 get / set.
                for (let prop in scope) {
                    if (!scope.hasOwnProperty(prop) 
                        || prop === "$name" 
                        || prop === "$directives" 
                        || prop === "$initFunc"
                        || prop === "$ctrlDoms"
                        || prop === "$dependencies"
                    ) { continue; }
                    
                    // 监视 scope 中的属性.
                    $lc.observe(scope, prop, null, $directivesDataSync);
                }
        
            })();
            
            // 初始化控制器节点与其子节点, 建立指令对象并推入 $directives.
            for (let i = 0, length = scope.$ctrlDoms.length; i < length; i++) {
                var directivesOfCtrl = $lc.getDirectives(scope.$ctrlDoms[i]);

                // 处理控制器上的额外指令.
                if (directivesOfCtrl) {
                    directivesOfCtrl.forEach((directive, index, directives) => {
                        if (directive === "lc-cloak") return;  // lc-cloak 放至最后处理.
                        $lc.directives[directive] && new $lc.directives[directive](scope.$ctrlDoms[i])
                    });
                }

                initController(scope.$ctrlDoms[i], scope);

                // 控制器节点处理完之后修改 lc-controller. 就是方便查看是不是初始化完毕了.
                scope.$ctrlDoms[i].setAttribute("lc-ctrl", scope.$name);
                scope.$ctrlDoms[i].removeAttribute("lc-controller");
                scope.$ctrlDoms[i].removeAttribute("lc-cloak");
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
                    var directiveList = $lc.getDirectives(child);

                    // 初始化指令.
                    for (let i = 0, length = directiveList.length; i < length; i++) {
                        scope.$directives.push(new $lc.directives[directiveList[i]](child, scope));  // 创建指令对象并推入控制器下的 $directives.

                        // 当出现优先级为 10000 的指令时仅仅初始化自身, 中止执行.
                        if ($lc.directives[directiveList[i]].priority === 10000) {
                            break;
                        }
                    }
                }
            }

            // 初始化指令.
            
        })(ctrlDom.children);
        
    }

}
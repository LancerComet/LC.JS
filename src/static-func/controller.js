// Lancer Frame V0.0.1 By LancerComet at 15:39, 2016.06.02.
// # Carry Your World #

import {_} from "../_/_"
export {controller}

// Definition: 框架控制器定义函数.
// lc.controller("ctrlName", ["moduleA"], function (scope) {})
function controller ($lc) {
    
    $lc.controllers = {};
    $lc.controller = function (ctrlName, dependencies, initFunc) {
        // @ params: 模块名称, 依赖模块, 模块初始化函数.
    
        if (_.typeof(dependencies) !== "array") {
            initFunc = dependencies;
            dependencies = [];
        }
        
        // 定义控制器作用域对象.
        var scope = {
            $name: ctrlName
        };
        
        $lc.controllers[ctrlName] = scope;
        
        
        initFunc && (() => {         
            initFunc.bind(scope)();  // 将控制器对象放入 initFunc 中执行.
            
            // 为每个用户定义的属性设置 get / set.
            for (let prop in scope) {
                if (!scope.hasOwnProperty(prop) || prop === "$name") { continue; }
                
                // 在自执行函数中创建闭包来保留每个属性的 key 与 value 的各自引用 propKey, propValue 以避免属性相互干扰.
                (() => {
                    
                    var propKey = prop,
                        propValue = scope[prop];
                        ctrlDoms = null;  // 控制器节点, 放至此处进行缓存, 用于用户更新数据后进行数据同步.
                    
                    Object.defineProperty(scope, propKey, {
                        get: function () {
                            return propValue;
                        },
                        
                        set: function (newValue) {
                            !ctrlDoms && (ctrlDoms = document.querySelectorAll(`[lc-controller=${ctrlName}]`));  // 获取页面中所有此控制器所属节点.
                            console.log(`${ctrlName}.${itemKey} 从 ${itemValue} 修改为 ${newValue}`);
                            itemValue = newValue;  // 用户修改值之后进行更新.
                            syncController(ctrlDoms, itemKey, itemValue);  // 同步页面中所有此控制器节点中的数据.
                        }
                    });
                    
                })();
                
            }
            
            // 初始控制器节点与其子节点.
            var ctrlDoms = document.querySelectorAll(`[lc-controller=${ctrlName}]`);
            for (let i = 0, length = ctrlDoms.length; i < length; i++) {
                initChildren(ctrls[i], scope);
            }
            
        })();
    
    };
    
    
    // Definition: 初始化控制器内的子节点指令.
    function initChildren (ctrlDom, scope) {
        var ctrlChildren = ctrlDom.children;
        
        for (let i = 0, length = ctrlChildren.length; i < length; i++) {
            var child = ctrlChildren[i];
            
            // 获取节点上注册的指令.
            for (let i = 0, length = child.attributes.length; i < length; i++) {
                var attr = child.attributes[i].name;
                var attrValue = child.attributes[i].value;
                // TODO: 初始化指令.
            }
                            
               
            
        }
        
    }
    
    
    
    
    // Definition: 控制器数据同步函数.
    // 在 get / set 中调用.
    function syncController (ctrlDoms, key, newValue) {
        "use strict";
        
        // 循环控制器节点.
        for (let i = 0, length = ctrlDoms.length; i < length; i++) {
            
            // 循环控制器节点内的子节点.
            (function bindData (children) {
                
                for (let i = 0, length = children.length; i < length; i++) {
                    var child = children[i];
                    
                    // 修改相应指令的值.
                    // 修改了 innerHTML 的指令.
                    if (child.attributes["lc-text"] && child.attributes["lc-model"] && child.attributes["lc-html"]) {
                        (child.attributes["lc-html"] && child.attributes["lc-html"].value === key) && $lc.directives.html.$update(child, newValue);
                        (child.attributes["lc-text"] && child.attributes["lc-text"].value === key) && $lc.directives.text.$update(child, newValue);
                        (child.attributes["lc-model"] && child.attributes["lc-model"].value === key) && $lc.directives.model.$update(child, newValue);
                    } else {
                        // 没有修改 innerHTML 的指令.
                        child.children.length > 0 && bindData(child.children);
                    }                 
                    
                }
                
                
            })(ctrlDoms[i].children);
            
        }
        
    }
    
};


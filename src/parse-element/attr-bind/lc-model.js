/*
 *  Elements Parsing module By LancerComet at 18:37, 2016.02.29.
 *  # Carry Your World #
 *  ---
 *  lc-model 处理函数.
 *  
 *  Inspired By http://www.ituring.com.cn/article/48463.
 */

module.exports = function (element, key, ctrl) {
    
    // 监视 key 属性, 自动更新节点数值.
    ctrl.$watch(key, function (newVal, oldVal) {
        element.value = newVal || "";
    });
    
    // 从节点中数据更新控制器中的属性.
    element.onkeyup = function () {
        ctrl[key] = element.value;
    };
    
    element.onpaste = function () {
        ctrl[key] = element.value;
    };
    
};
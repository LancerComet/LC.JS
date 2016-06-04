/*
 *  Controller Data Sync Function by LancerComet at 15:10, 2016/6/4.
 *  # Carry Your World #
 *  ---
 *  控制器内部指令数据同步方法.
 *  在控制器初始化时进行 set 定义时被设置为 setCallback.
 */

export function $directivesDataSync (scope, expr, oldValue, newValue) {
    console.log(`${scope.$name}.${expr} 从 ${oldValue} 修改为 ${newValue}`);
    scope.$directives.forEach((directiveObj, index, $directives) => directiveObj.$expr === expr && directiveObj.$update(newValue));
}
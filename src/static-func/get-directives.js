/*
 *  Get Directives Function By LancerComet at 14:45, 2016/6/6.
 *  # Carry Your World #
 *  ---
 *  获取节点指令.
 *  @ Array.
 */

export function getDirectives ($lc) {

    $lc.getDirectives = function (element) {
        var directiveList = [];

        // 获取指令属性.
        for (let i = 0, length = element.attributes.length; i < length; i++) {
            const directiveName = element.attributes[i].name;  // 指令名称.
            if (directiveName.indexOf("lc-") < 0) { continue; }

            // 如果 $lc.directives 中有相应指令则初始化指令.
            if ($lc.directives[directiveName]/* && directiveExpr*/) {  // 暂时取消 expr 的强制判断, 否则必须制定 expr, 有时候指令可能不想或不需要制定 expr, 观察功能是否正常.
                directiveList.push(directiveName);
            }
        }

        // 为指令优先级进行排序.
        for (let sortTime = 0, length = directiveList.length; sortTime < length; sortTime++) {
            for (let i = 0; i < length; i++) {
                if (i === length - 1) continue;
                if ($lc.directives[directiveList[i]].priority < $lc.directives[directiveList[i + 1]].priority) {
                    var swap = directiveList[i];
                    directiveList[i] = directiveList[i + 1];
                    directiveList[i + 1] = swap;
                }
            }
        }

        return directiveList;
    };

}
/*
 *  Get Directives Function By LancerComet at 12:02, 2016/6/8.
 *  # Carry Your World #
 *  ---
 *  获取子元素方法.
 */

export function find ($lc) {

    $lc.findChildren = function (parent, querySelector) {
        var result = [];
        if (!parent.querySelectorAll) {
            console.log("在使用 findChildren 时请传入 HTML Element.");
            return;
        }
        result = parent.querySelectorAll(querySelector);
        return result;
    };

}
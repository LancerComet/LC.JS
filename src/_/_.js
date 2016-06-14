// Lancer Frame V0.0.1 By LancerComet at 12:09, 2016.06.02.
// # Carry Your World #
// ---
// Internal Functions.

export const _ = {
    typeof: (target) => Object.prototype.toString.call(target).match(/ \S*/i)[0].replace(" ", "").replace("]", "").toLowerCase(),
    browser: () => {
        var result = "";
        const browser = navigator.appVersion;

        // 判断是否为 IE 系.
        if (window.ScriptEngine || browser.indexOf("Trident") > -1) {
            // IE9.
            if (browser.indexOf("MSIE 9.0") > -1) result = "IE 9";

            // IE Morden.
            if (browser.indexOf("MSIE 10.0") > -1 || (browser.indexOf("Trident/7.0") > -1 && browser.indexOf("rv:11.0") > -1)) result = "IE Modern";

            // Edge.
            if (browser.indexOf("Edge") > -1) result = "Edge";
        } else if (browser.indexOf("Chrome/") > -1) {
            result = "Chrome";
        }

        return result;
    },
    strip: (str, target) => str.replace(new RegExp(`${target}`, "g"), ""),

    // 检测过滤器方法, 查询指令中的过滤器名称.
    findFilter: directive => {
        directive = _.strip(directive, " ");
        directive = directive.match(/\|\S*/);
        if (_.typeof(directive) === "array" && directive[0]) directive = directive[0].replace("|", "");
        return directive;
    },

    // 删除过滤器函数.
    removeFilter: directive => directive.substr(0, directive.indexOf("|") - 1),

    // 获取节点属性函数.
    getAttrs: element => {
        var result = {};
        var attrs = element.attributes;
        for (let i = 0, length = attrs.length; i < length; i++) {
            result[attrs[i].name] = attrs[i].value;
        }
        return result;
    }
};
/*
 *  Find Children By Attribute By LancerComet at 17:01, 2016/3/18.
 *  # Carry Your World #
 */

module.exports = function (parent, attr, value) {
    var children = parent.children;
    var result = [];

    for (var i = 0, length = children.length; i < length; i++) {
        var child = children[i];

        // 如果匹配到了 attr = value.
        console.log(child.attributes[attr] ? child.attributes[attr].value : "no this attr")

        // 如果提供了 value 参数则匹配 value.
        if (value) {
            if (child.attributes[attr] && child.attributes[attr].value === value) {
                result.push(child);
            }
            if (child.children.length) {
                result = result.concat(findChildren(child, attr, value));
            }
        } else {  // 没有提供则不做 value 匹配.
            if (child.attributes[attr]) {
                result.push(child);
            }
            if (child.children.length) {
                result = result.concat(findChildren(child, attr, value));
            }
        }

    }

    return result;
};

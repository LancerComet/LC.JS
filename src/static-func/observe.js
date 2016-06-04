/*
 *  LancerFrame observe Function By LancerComet at 14:10, 2016.06.04.
 *  # Carry Your World #
 *  ---
 *  $lc.observe 函数, 使用 get / set 进行数据监听.
 */

import {_} from "../_/_"

export function observe ($lc) {
    ((undefined) => {  // 创建一个纯净的 undefined
        $lc.observe = function (obj, prop, getCallback, setCallback) {
            var propKey = prop,
                propValue = obj[prop],
                oldValue = obj[prop],
                newValue = null;

            if (propValue === undefined) {
                console.error(`不存在监听属性 ${prop}.`);
                return;
            }

            if (getCallback && _.typeof(getCallback) !== "function") {
                console.error(errorText("getCallback"));
                return;
            }

            if (setCallback && _.typeof(setCallback) !== "function") {
                console.error(errorText("setCallback"));
                return;
            }

            Object.defineProperty(obj, propKey, {
                get: function () {
                    getCallback && getCallback(oldValue, newValue);
                    return propValue;
                },

                set: function (newVal) {
                    oldValue = propValue;
                    newValue = newVal;
                    propValue = newValue;  // 用户修改值之后进行更新.
                    setCallback && setCallback(obj, propKey, oldValue, newValue);
                }
            });
        };
    })();
}

function errorText (type) {
    return `$lc.observe 注册 ${type} 时类型必须为 Function.`;
}
/*
 *  LancerFrame Internal Service by LancerComet at 12:06, 2016/6/3.
 *  # Carry Your World #
 *  ---
 *  内置服务定义.
 */

export function internalSerivces ($lc) {

    // $q.
    // 基于 Promise, 不做任何兼容处理.
    (() => {
        if (!window.Promise) return;
        $lc.service("$q", function () {
            return function (asyncFunc) {
                return new Promise (function (resolve, reject) {
                    asyncFunc && asyncFunc(resolve, reject);
                });
            }
        });
    })();


    // $http.
    $lc.service("$http", function () {
        return {
            get: (url, data) => {

            },
            post: (url, data) => {

            },
            jsonp: (url, data, callbackName, callback) => {

            }
        }
    });
}
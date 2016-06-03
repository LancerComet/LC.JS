/*
 *  LancerFrame Serivce Module By LancerComet at 11:14, 2016/6/3.
 *  # Carry Your World #
 *  ---
 *  $lc.service 静态方法.
 */

export function service ($lc) {

    $lc.services = {};

    $lc.service = function (name, initFunc) {
        $lc.services[name] = initFunc();
    };

    $lc.service("ajax", function () {
        return {
            get: function () {
                console.log("get func")
            },

            post: function () {
                console.log("post func")
            }
        }
    });

}



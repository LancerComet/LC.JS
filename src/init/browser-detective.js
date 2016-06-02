/*
 *   Explorer Detective By LancerComet at 11:30, 2015/11/25.
 *   # Carry Your World #
 *   ---
 *
 *   信息:
 *   ---
 *   浏览器检测模块.
 *
 *   用法:
 *   ---
 *   var browserIs = require("func-explorer-detective")();  // browserIs 的值即为当前浏览器.
 *
 *   License：
 *   ---
 *   © 2015 LancerComet @ MIT License.
 *
 */

module.exports = explorerDetective;

function explorerDetective () {
    var userAgent = window.navigator.appVersion;
    var browser = {
        myBrowser : "unknown",
        database: [
            { type: "IE Legacy", regExp: "MSIE [1-6].*"},  // IE 1-6
            { type: "IE 7", regExp: "MSIE [7].*"},  // IE 7
            { type: "IE 8", regExp: "MSIE [8].*"},  // IE 8, 不支持 CSS3 与 HTML5.
            { type: "IE 9", regExp: "MSIE [9].*"},  // IE 9, 支持部分 CSS3 与 HTML5.
            { type: "IE Modern", regExp: "Trident/[6-9].*" },  // gt IE 10, 支持 CSS3 与 HTML5.
            //{ type: "IE No CSS3", regExp: "MSIE [1-9].*" },  // lt IE 10, 不支持 CSS3.
            { type: "Firefox", regExp: "Firefox/[0-9].*" },
            { type: "Safari", regExp: "AppleWebKit/[0-9].*.Safari/[0-9]" },
            { type: "Chrome", regExp: "AppleWebKit/[0-9].*.Chrome/[0-9].*.Safari/[0-9]" },
            { type: "Opera Presto", regExp: "Opera.[0-9].*.Presto/[0-9]" },
            { type: "Opera Modern", regExp: "OPR/[0-9][0-9]" },
            { type: "Edge", regExp: "Edge/[0-9].*" },
            { type: "Maxthon 4", regExp: "Maxthon/[4]" }
        ]
    };

    (function matchExplorer () {
        for (var i = 0, length = browser.database.length; i < length; i++) {
            var newRegExp = new RegExp(browser.database[i].regExp);
            if(userAgent.match(newRegExp)){
                browser.myBrowser = browser.database[i].type;
            }
        }
    })();

    return browser.myBrowser;
}

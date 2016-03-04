/*
 *  Elements Parsing module By LancerComet at 18:18, 2016.02.29.
 *  # Carry Your World #
 *  ---
 *  框架节点处理方法.
 *  
 *  Inspired By http://www.ituring.com.cn/article/48463.
 */
Object.prototype.extend = function (object) {
    for (var i in object) {
        if (object.hasOwnProperty(i)) {
            this[i] = object[i];
        }
    }
};


function parseElement (element, controller) {
    var ctrl = controller;
    
    if (element.getAttribute("lc-controller")) {
        ctrl = createController(element.getAttribute("lc-controller"));
    }
    
    (function () {
        for (var i = 0, length = element.attributes.length; i < length; i++) {
            parseAttribute(element, element.attributes[i], ctrl);
        }
    })();
    
    (function () {
        for (var i = 0, length = element.children.length; i < length; i++) {
            parseElement(element.children[i], ctrl);
        }
    })();
    
}

function createController (ctrlName) {
    var ctrl = lc.require(ctrlName, true);
    var instance = new ctrl();
    instance.$watchers = {};
    instance.extend(require("./Binder"));
    return instance;
}

function parseAttribute (element, attr, ctrl) {
    if (attr.name.indexOf("lc-") == 0) {
        var type = attr.name.slice("3");
        switch (type) {
            case "init":  // lc-init
                break;
            case "model":
                require("./attr-bind/lc-model")(element, attr.value, ctrl);
                break;
            case "click":
                break;
            case "enable":
                break;
            case "disable":
                break;
            case "visible":
                break;
            case "invisible":
                break;
            case "element":
                break;
        }
    }
}

module.exports = parseElement;
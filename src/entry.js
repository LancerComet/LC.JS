// Lancer Frame V0.0001 By LancerComet at 18:32, 2016.01.17.
// # Carry Your World #


// Modules Requirement.
// ===============================
// Definition: 框架初始化方法对象.
var initFuncs = {
    _scanCtrlDoms: require("./dom-ctrl/dom-scan")  // 节点扫描模块.
};



// Definition: LancerFrame 本体定义.
// ===============================
var LancerFrame = function () {
    if (!(this instanceof LancerFrame)) {
        return new LancerFrame();
    }
    
    this.init();  // 初始化框架.
};

// Definition: 框架初始化函数.
LancerFrame.prototype.init = function () {
    initFuncs._scanCtrlDoms();  // 01: 扫描控制器节点.
};


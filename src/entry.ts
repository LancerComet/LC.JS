// Lancer Frame V0.0001 By LancerComet at 18:32, 2016.01.17.
// # Carry Your World #


// Modules Requirement.
// ===============================
import DomScan = require("./dom-ctrl/dom-scan");  // 节点扫描模块.

// Definition: 框架初始化方法对象.
const initFuncs = {
    _scanCtrlDoms: DomScan.scanCtrlDoms
};



// Definition: LancerFrame 本体定义.
// ===============================
class LancerFrame {
    
    constructor () {
        this.init();  // 初始化框架.
    }
    
    // Definition: 框架初始化函数.
    init () {
        initFuncs._scanCtrlDoms();  // 01: 扫描控制器节点.
    }    
    
}




// var LancerFrame : () => void = function () : void {
    
//     if (!this.instanceof(LancerFrame)) {
//         return new LancerFrame();
//     }
    
// };
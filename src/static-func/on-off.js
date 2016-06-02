/*
 *  LancerFrame on Function By LancerComet at 22:58, 2016.03.05.
 *  # Carry Your World #
 *  ---
 *  $lc.on
 */

export function on ($lc) {
    $lc.on = function (element, eventType, eventHanler) {
        if (element.addEventListener) {
            element.addEventListener(eventType, eventHanler, false);
        } else if (element.attachEvent) {
            element.attachEvent(`on${eventType}`, eventHanler);
        } else {
            element[`on${eventType}`] = eventHanler;
        }
    };
}

export function off ($lc) {
    $lc.off = function (element, eventType, eventHanler) {
        if (element.removeEventListener) {
            element.removeEventListener(eventType, eventHanler, false);
        } else if (element.detachEvent) {
            element.detachEvent(`on${eventType}`, eventHanler);
        } else {
            element[`on${eventType}`] = null;
        }
    };
}
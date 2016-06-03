/**
 * Created by user on 2016/6/3.
 */

import {service} from "./service"
import {internalSerivces} from "./internal-service"

export function serviceMain ($lc) {
    service($lc);
    internalSerivces($lc);
}
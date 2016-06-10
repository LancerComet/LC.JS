/*
 *  Log Function By LancerComet at 23:13, 2016/6/10.
 *  # Carry Your World #
 *  ---
 *  日志函数.
 */

export function log ($lc) {
    $lc.log = {
        success: (str) => console.log(`[success] $lc: ${str}`),
        caution: (str) => console.log(`[caution] $lc: ${str}`),
        error: (str) => console.log(`[error] $lc: ${str}`),
        info: (str) => console.log(`$lc: ${str}`)
    };
}
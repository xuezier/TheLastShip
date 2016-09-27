declare const process;
export const _isNode = typeof process === "object"
export const _isBorwser = !_isNode;
// const devicePixelRatio = window["_isMobile"] ? 2 : 1;
export const pt2px = (pt) => pt * 2;//((window.devicePixelRatio) || 1);//px 转 pt

export const L_ANI_TIME = 1225;
export const B_ANI_TIME = 375;
export const M_ANI_TIME = 225;
export const S_ANI_TIME = 195;

export function mix_options(tmp_options, new_options) {
    for (var key in new_options) {
        if (tmp_options.hasOwnProperty(key)) {
            if (tmp_options[key] instanceof Object) {
                mix_options(tmp_options[key], new_options[key])
            } else {
                tmp_options[key] = new_options[key]
            }
        }
    }
}
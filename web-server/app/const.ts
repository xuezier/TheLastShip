declare const process;
export const _isNode = typeof process === "object"
export const _isBorwser = !_isNode;
export const _isMobile = this._isMobile;
const devicePixelRatio = typeof _isMobile === "boolean"&&_isMobile ? 1 : 1;
const __pt2px = devicePixelRatio * 2;
export const pt2px = (pt) => pt * __pt2px;

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
export function assign(to_obj, from_obj) {
    for (var key in from_obj) {
        if (from_obj.hasOwnProperty(key)) {
        	var value = from_obj[key];
            if (from_obj[key] instanceof Object) {
                assign(to_obj[key]||(to_obj[key] = new value.constructor()), value)
            } else {
                to_obj[key] = value
            }
        }
    }
    return to_obj
}
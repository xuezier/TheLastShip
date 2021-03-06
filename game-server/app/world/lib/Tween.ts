/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */


const Easing = {

    Linear: {
        None: function (k) {
            return k;
        }
    },
    Quadratic: {
        In: function (k) {
            return k * k;
        },
        Out: function (k) {
            return k * (2 - k);
        },
        InOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k;
            }
            return - 0.5 * (--k * (k - 2) - 1);
        }
    },
    Cubic: {
        In: function (k) {
            return k * k * k;
        },
        Out: function (k) {
            return --k * k * k + 1;
        },
        InOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k + 2);
        }
    },
    Quartic: {
        In: function (k) {
            return k * k * k * k;
        },
        Out: function (k) {
            return 1 - (--k * k * k * k);
        },
        InOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k;
            }
            return - 0.5 * ((k -= 2) * k * k * k - 2);
        }
    },
    Quintic: {
        In: function (k) {
            return k * k * k * k * k;
        },
        Out: function (k) {
            return --k * k * k * k * k + 1;
        },
        InOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        }
    },
    Sinusoidal: {
        In: function (k) {
            return 1 - Math.cos(k * Math.PI / 2);
        },
        Out: function (k) {
            return Math.sin(k * Math.PI / 2);
        },
        InOut: function (k) {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        }
    },
    Exponential: {
        In: function (k) {
            return k === 0 ? 0 : Math.pow(1024, k - 1);
        },
        Out: function (k) {
            return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);
        },
        InOut: function (k) {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if ((k *= 2) < 1) {
                return 0.5 * Math.pow(1024, k - 1);
            }
            return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);
        }
    },
    Circular: {
        In: function (k) {
            return 1 - Math.sqrt(1 - k * k);
        },
        Out: function (k) {
            return Math.sqrt(1 - (--k * k));
        },
        InOut: function (k) {
            if ((k *= 2) < 1) {
                return - 0.5 * (Math.sqrt(1 - k * k) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        }
    },
    Elastic: {
        In: function (k) {
            var s;
            var a = 0.1;
            var p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }
            return - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
        },
        Out: function (k) {
            var s;
            var a = 0.1;
            var p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }
            return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
        },
        InOut: function (k) {
            var s;
            var a = 0.1;
            var p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }
            if ((k *= 2) < 1) {
                return - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            }
            return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
        }
    },
    Back: {
        In: function (k) {
            var s = 1.70158;
            return k * k * ((s + 1) * k - s);
        },
        Out: function (k) {
            var s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;
        },
        InOut: function (k) {
            var s = 1.70158 * 1.525;
            if ((k *= 2) < 1) {
                return 0.5 * (k * k * ((s + 1) * k - s));
            }
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }
    },
    Bounce: {
        In: function (k) {
            return 1 - TWEEN.Easing.Bounce.Out(1 - k);
        },
        Out: function (k) {
            if (k < (1 / 2.75)) {
                return 7.5625 * k * k;
            } else if (k < (2 / 2.75)) {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            } else if (k < (2.5 / 2.75)) {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            } else {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }
        },
        InOut: function (k) {
            if (k < 0.5) {
                return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
            }
            return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
        }
    }
};


const Interpolation = {

    Linear(v, k) {

        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);
        var fn = TWEEN.Interpolation.Utils.Linear;

        if (k < 0) {
            return fn(v[0], v[1], f);
        }

        if (k > 1) {
            return fn(v[m], v[m - 1], m - f);
        }

        return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

    },

    Bezier(v, k) {

        var b = 0;
        var n = v.length - 1;
        var pw = Math.pow;
        var bn = TWEEN.Interpolation.Utils.Bernstein;

        for (var i = 0; i <= n; i++) {
            b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
        }

        return b;

    },

    CatmullRom(v, k) {

        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);
        var fn = TWEEN.Interpolation.Utils.CatmullRom;

        if (v[0] === v[m]) {

            if (k < 0) {
                i = Math.floor(f = m * (1 + k));
            }

            return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

        } else {

            if (k < 0) {
                return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
            }

            if (k > 1) {
                return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
            }

            return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

        }

    },

    Utils: {

        Linear: function (p0, p1, t) {

            return (p1 - p0) * t + p0;

        },

        Bernstein: function (n, i) {

            var fc = TWEEN.Interpolation.Utils.Factorial;

            return fc(n) / fc(i) / fc(n - i);

        },

        Factorial: (function () {

            var a = [1];

            return function (n) {

                var s = 1;

                if (a[n]) {
                    return a[n];
                }

                for (var i = n; i > 1; i--) {
                    s *= i;
                }

                a[n] = s;
                return s;

            };

        })(),

        CatmullRom: function (p0, p1, p2, p3, t) {

            var v0 = (p2 - p0) * 0.5;
            var v1 = (p3 - p1) * 0.5;
            var t2 = t * t;
            var t3 = t * t2;

            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

        }

    }

};
export interface EasingFunction {
    (k: number): number
}
export class Tween {
    private _t: TWEEN;
    _object: any;
    private _valuesStart: any = {};
    private _valuesEnd: any = {};
    private _valuesStartRepeat: any = {};
    private _duration: number = 1000;
    private _repeat: number = 0;
    private _yoyo: boolean = false;
    private _isPlaying: boolean = false;
    private _reversed: boolean = false;
    private _delayTime: number = 0;
    private _startTime: number;
    private _easingFunction: EasingFunction = TWEEN.Easing.Linear.None;
    private _interpolationFunction/*(v: number, k: number): number*/ = TWEEN.Interpolation.Linear;
    private _chainedTweens: Tween[] = [];
    private _siblingTweens: Tween[] = [];
    private _onStartCallback = null;
    private _onStartCallbackFired = null;
    private _onUpdateCallback = null;
    private _onCompleteCallback = null;
    private _onStopCallback = null;
    private _debug: boolean = false;
    public set(properties: any): Tween {
        var _valuesStart = this._valuesStart
        var object = this._object;
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                _valuesStart[key] = object[key] = properties[key];
            }
        }
        return this;
    }
    public to(properties: any, duration: number): Tween {

        if (duration !== undefined) {
            this._duration = duration;
        }

        var _valuesEnd = this._valuesEnd = properties;
        var _valuesStart = this._valuesStart
        var object = this._object;

        for (var key in _valuesEnd) {
            if (!_valuesStart.hasOwnProperty(key)) {
                _valuesStart[key] = parseFloat(object[key]);
            }
        }

        return this;

    }
    public start(time?: number): Tween {

        this._t.add(this);

        this._isPlaying = true;

        this._onStartCallbackFired = false;

        this._startTime = time !== undefined ? time : performance.now();
        this._startTime += this._delayTime;

        var _valuesEnd = this._valuesEnd;
        var _object = this._object
        var _valuesStart = this._valuesStart;
        var _valuesStartRepeat = this._valuesStartRepeat;
        var _siblingTweens = this._siblingTweens;

        for (var property in _valuesEnd) {

            // Check if an Array was provided as property value
            if (_valuesEnd[property] instanceof Array) {

                if (_valuesEnd[property].length === 0) {
                    continue;
                }

                // Create a local copy of the Array with the start value at the front
                _valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

            }

            // If `to()` specifies a property that doesn't exist in the source object,
            // we should not set that property in the object
            if (_valuesStart[property] === undefined) {
                continue;
            }

            _valuesStart[property] = _object[property];

            if ((_valuesStart[property] instanceof Array) === false) {
                _valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
            }

            _valuesStartRepeat[property] = _valuesStart[property] || 0;

        }

        for (var i = 0, len = _siblingTweens.length; i < len; i++) {
            _siblingTweens[i].start(time);
        }

        return this;

    }
    public stop(): Tween {
        if (!this._isPlaying) {
            return this;
        }

        this._t.remove(this);
        this._isPlaying = false;

        if (this._onStopCallback !== null) {
            this._onStopCallback.call(this._object);
        }

        this.stopChainedTweens();

        var _siblingTweens = this._siblingTweens;
        for (var i = 0, len = _siblingTweens.length; i < len; i++) {
            _siblingTweens[i].stop();
        }

        return this;
    };
    public stopChainedTweens(): void {
        var _chainedTweens = this._chainedTweens;
        for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
            _chainedTweens[i].stop();
        }
    };
    public delay(amount): Tween {
        this._delayTime = amount;
        return this
    }

    public repeat(times): Tween {
        this._repeat = times;
        return this;
    };
    public yoyo(yoyo): Tween {
        this._yoyo = yoyo;
        return this;
    };
    public easing(easing: EasingFunction): Tween {
        this._easingFunction = easing;
        return this;
    };
    public interpolation(interpolation): Tween {
        this._interpolationFunction = interpolation;
        return this
    };
    public chain(...tweens: Tween[]): Tween {
        this._chainedTweens = Array.prototype.slice.call(arguments);
        return this
    };
    public with(...tweens: Tween[]): Tween {
        this._siblingTweens = tweens.slice();
        return this
    };
    public onStart(callback): Tween {
        this._onStartCallback = callback;
        return this
    };
    public onUpdate(callback): Tween {
        this._onUpdateCallback = callback;
        return this
    };
    public onComplete(callback): Tween {
        this._onCompleteCallback = callback;
        return this
    };

    public onStop(callback): Tween {
        this._onStopCallback = callback;
        return this
    };
    public debug(debug: boolean): Tween {
        this._debug = debug;
        return this
    };
    public update(time?: number): boolean {
        var property;
        var elapsed;
        var value;

        if (time < this._startTime) {
            return true;
        }
        if (this._debug) {
            debugger
        }

        var _object = this._object;
        var _valuesEnd = this._valuesEnd;
        var _valuesStart = this._valuesStart;
        var _duration = this._duration;
        var _easingFunction = this._easingFunction;
        var _interpolationFunction = this._interpolationFunction;
        var _onUpdateCallback = this._onUpdateCallback;
        var _valuesStartRepeat = this._valuesStartRepeat;
        var _onCompleteCallback = this._onCompleteCallback;
        var _chainedTweens = this._chainedTweens;

        if (this._onStartCallbackFired === false) {

            if (this._onStartCallback !== null) {
                this._onStartCallback.call(_object);
            }

            this._onStartCallbackFired = true;

        }

        elapsed = (time - this._startTime) / _duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        value = _easingFunction(elapsed);

        for (property in _valuesEnd) {

            // Don't update properties that do not exist in the source object
            if (_valuesStart[property] === undefined) {
                continue;
            }

            var start = _valuesStart[property] || 0;
            var end = _valuesEnd[property];

            if (end instanceof Array) {

                _object[property] = _interpolationFunction(end, value);

            } else {

                // Parses relative end values with start as base (e.g.: +10, -3)
                if (typeof end === 'string') {

                    if (end.indexOf('+') === 0 || end.indexOf('-') === 0) {
                        end = start + parseFloat(end);
                    } else {
                        end = parseFloat(end);
                    }
                }

                // Protect against non numeric properties.
                if (typeof (end) === 'number') {
                    _object[property] = start + (end - start) * value;
                }

            }

        }

        if (_onUpdateCallback !== null) {
            _onUpdateCallback.call(_object, value);
        }

        if (elapsed === 1) {

            if (this._repeat > 0) {

                if (isFinite(this._repeat)) {
                    this._repeat--;
                }

                // Reassign starting values, restart by making startTime = now
                for (property in _valuesStartRepeat) {

                    if (typeof (_valuesEnd[property]) === 'string') {
                        _valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property]);
                    }

                    if (this._yoyo) {
                        var tmp = _valuesStartRepeat[property];

                        _valuesStartRepeat[property] = _valuesEnd[property];
                        _valuesEnd[property] = tmp;
                    }

                    _valuesStart[property] = _valuesStartRepeat[property];

                }

                if (this._yoyo) {
                    this._reversed = !this._reversed;
                }

                this._startTime = time + this._delayTime;

                return true;

            } else {

                if (_onCompleteCallback !== null) {
                    _onCompleteCallback.call(_object);
                }

                for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                    // Make the chained tweens start exactly at the time they should,
                    // even if the `update()` method was called way past the duration of the tween
                    _chainedTweens[i].start(this._startTime + _duration);
                }

                return false;

            }

        }

        return true;

    };
    constructor(t: TWEEN, object) {
        this._t = t;
        this._object = object;

        var _valuesStart = this._valuesStart;

        for (var field in object) {
            try {
                _valuesStart[field] = parseFloat(object[field]);
            } catch (e) { }
        }

        t.addToWait(this);

    }
}


export default class TWEEN {
    private _wait_tweens: Tween[] = []
    private _tweens: Tween[] = []
    private _is_stop = false
    private _is_lock = false
    private _map: { [propName: string]: Tween } = {}

    getAll() {

        return this._tweens;

    }

    removeAll() {

        this._tweens = [];

    }

    add(tween: Tween) {
        if (this._is_lock) {
            return
        }
        if (this._tweens.indexOf(tween) === -1) {
            this._tweens.push(tween);
        }
    }

    addToWait(tween: Tween) {

        this._wait_tweens.push(tween)
    }

    remove(tween) {

        var i = this._tweens.indexOf(tween);

        if (i !== -1) {
            this._tweens.splice(i, 1);
        }

    }

    clear(id?: string) {
        if (id) {
            var map = this._map;
            var remover_tween = map.hasOwnProperty(id) && map[id];
            if (remover_tween) {
                remover_tween.stop();
                this.remove(remover_tween);
                delete map[id];
            }
        } else {
            var _tweens = this._tweens.slice();
            for (var i = 0, len = _tweens.length; i < len; i += 1) {
                _tweens[i].stop();
            }
        }
    }

    update(time?: number) {

        if (this._is_stop) {
            return false;
        }

        if (this._tweens.length === 0) {
            return false;
        }

        var i = 0;

        time = time !== undefined ? time : performance.now();

        while (i < this._tweens.length) {

            if (this._tweens[i].update(time)) {
                i++;
            } else {
                this._tweens.splice(i, 1);
            }

        }

        return true;

    }
    /** 开始当前队列中的动画 */
    start() {
        this._wait_tweens.forEach(tween => {
            tween.start()
        });
        this._wait_tweens = [];
    }

    /** 停止当前动画 */
    stop(is_stop: boolean) {

        return this._is_stop = is_stop;

    }
    /** 停止新动画的添加，但不停止当前动画 */
    lock(is_lock: boolean) {

        return this._is_lock = is_lock;

    }

    Tween(obj): Tween
    Tween(id: string, obj?, is_cover?: boolean): Tween
    Tween(id_or_obj, obj?, is_cover?) {
        if (obj || typeof id_or_obj === "string") {
            var map = this._map;
            if (map.hasOwnProperty(id_or_obj)) {
                var res = map[id_or_obj];
                if (!(is_cover && res._object !== obj)) {
                    return res;
                }
            }
            return map[id_or_obj] = new Tween(this, obj)
        }
        return new Tween(this, id_or_obj);
    }

    static Easing = Easing
    static Interpolation = Interpolation
    static Tween = Tween

    isAnimatting(obj: any) {
        return this._tweens.some(tween => {
            return tween._object === obj;
        });
    }
};



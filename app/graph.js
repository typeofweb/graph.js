(function (global) {
    'use strict';

    var _ctx;
    var _initialized = false;
    var MAX_INT = Math.pow(2, 53) - 1;

    /**
     * Unified API for Graphjs
     *
     * @constructor
     */
    function Graphjs() {}

    /**
     * Returns default config
     * @return {Object} Default config
     */
    Graphjs.prototype.getDefaultConfig = function () {
        return {
            el: $('#main_canv')[0],
            step: 1,
            point: {
                x: 0.0,
                y: 0.0
            },
            offset: {
                x: 0.0,
                y: 0.0
            },
            zoom: {
                x: 1,
                y: 1
            }
        };
    };

    /**
     * Initialize the canvas for graphing
     * @param  {Object} config object to override default config
     * @return {Boolean}        true if everything's fine, false otherwise
     */
    Graphjs.prototype.init = function (config) {
        this.config = {};

        global.extend(this.config, this.getDefaultConfig(), config);
        _ctx = this.initializeCtx();
        _initialized = true;
        return true;
    };

    Graphjs.prototype.initializeCtx = function () {
        var ctx = this.config.el.getContext('2d');
        ctx.clearRect(0, 0, this.config.el.width, this.config.el.height);
        return ctx;
    };

    Graphjs.prototype.calculateStep = function () {
        return (this.config.step >= 1.0) ? this.config.step : 1.0;
    };

    Graphjs.prototype.getMaxXY = function () {
        return {
            x: this.config.el.width - this.config.offset.x - 1,
            y: this.config.el.height + this.config.offset.y - 1
        };
    };

    Graphjs.prototype.getMinXY = function () {
        return {
            x: 0.0 - this.config.offset.x,
            y: 0.0 + this.config.offset.y
        };
    };

    Graphjs.prototype.getFnForMethod = function (fn_val, method) {
        var fn;
        var h = this.calculateStep();

        switch (method) {
        case 'euler':
            fn = new Function('x', 'y', 'return ' + fn_val);
            return function (x, y) {
                return y + h * fn(x, y);
            };
        default:
        case 'pure':
            fn = new Function('x', 'return ' + fn_val);
            return function (x) {
                return fn(x);
            };
        }
    };

    /**
     * Returns calculated points to be plotted for given function
     * @return {Array(Point,)} Array of points
     */
    Graphjs.prototype.calcFunction = function (fn_val, method) {
        var h = this.calculateStep();
        var min = this.getMinXY();
        var max = this.getMaxXY();

        var calcFn = this.getFnForMethod(fn_val, method);

        var ret = {
            right: [],
            left: []
        };

        var current_x = this.config.point.x;
        var current_y = this.config.point.y;

        while (current_x <= max.x) {
            current_y = calcFn(this.config.zoom.x * current_x, this.config.zoom.y * current_y);
            ret.right.push({x: this.config.zoom.x * current_x, y: this.config.zoom.y * current_y});
            current_x += h;
        }

        current_x = this.config.point.x;
        current_y = this.config.point.y;

        while (current_x >= min.x) {
            current_y = calcFn(this.config.zoom.x * current_x, this.config.zoom.y * current_y);
            if (current_x !== this.config.point.x) {
                ret.left.unshift({x: this.config.zoom.x * current_x, y: this.config.zoom.y * current_y});
            }
            current_x -= h;
        }

        return this.takeCareOfAsymptotes(ret.left.concat(ret.right));
    };

    Graphjs.prototype.takeCareOfAsymptotes = function (arr) {
        arr.forEach(function (val, i) {
            if (Math.abs(arr[i].y) === Infinity) {
                arr[i].y = Math.sgn(arr[i].y) * MAX_INT;

                if ((i-1) in arr && (i+1) in arr) {
                    if (Math.sgn(arr[i-1].y) !== Math.sgn(arr[i+1].y)) {
                        arr[i].asymptote = true;
                    }
                }
            }
        });
        return arr;
    };

    Graphjs.prototype.draw = function (arr) {
        var _self = this;
        if (!arr) {
            throw new Error('No points to plot');
        }

        _ctx.beginPath();
        _ctx.moveTo(_self.getMinXY().x + _self.config.offset.x, -(arr[0].y) - _self.config.offset.y);

        arr.forEach(function (val, i) {
            if (i === 0) {
                return;
            }
            var method = (val.asymptote) ? 'moveTo' : 'lineTo';
            _ctx[method](+i, -(val.y) - _self.config.offset.y);
        });
        _ctx.stroke();
        _ctx.closePath();
    };

    global.Graphjs = Graphjs;

}(window));

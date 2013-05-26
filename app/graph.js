(function (global) {
    'use strict';

    var ctx;
    var initialized = false;

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
            el: $('main_canv')[0],
            step: 1,
            point: {
                x: 0.0,
                y: 0.0
            },
            offset: {
                x: 0.0,
                y: 0.0
            }
        };
    };

    /**
     * Initialize the canvas for graphing
     * @param  {Object} config object to override default config
     * @return {Boolean}        true if everything's fine, false otherwise
     */
    Graphjs.prototype.init = function (config) {
        global.extend(this.config, this.getDefaultConfig(), config);
        ctx = this.config.el.getContext('2d');
        ctx.clearRect(0, 0, this.config.el.width, this.config.el.height);
        initialized = true;
        return true;
    };

    Graphjs.prototype.calculateStep = function () {
        return (this.config.step >= 1.0) ? this.config.step : 1.0;
    };

    Graphjs.prototype.getMaxXY = function () {
        return {
            x: this.config.el.width + this.config.offset.x,
            y: this.config.el.height + this.config.offset.y
        };
    };

    Graphjs.prototype.getMinXY = function () {
        return {
            x: 0.0 - this.config.offset.x,
            y: 0.0 - this.config.offset.y
        };
    };

    Graphjs.prototype.getFnForMethod = function (fn_val, method, h) {
        var fn;

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

        var current_x = this.config.point.x;
        var current_y = this.config.point.y;

        var calcFn = this.getFnForMethod(fn_val, method, h);

        var ret = {
            right: [],
            left: []
        };

        while (current_x <= max.x) {
            current_y = calcFn(current_x, current_y);
            ret.left.push(current_x, current_y);
            current_x += h;
        }

        current_x = this.config.point.x;
        current_y = this.config.point.y;

        while (current_x >= min.x) {
            current_y = calcFn(current_x, current_y);
            ret.left.push(current_x, current_y);
            current_x -= h;
        }

        return ret.right.concat(ret.left);
    };

}(window));

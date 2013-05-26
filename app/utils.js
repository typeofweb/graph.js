(function (global) {
    'use strict';

    /**
     * Wrapper for querySelectorAll
     * @param  {String} selector proper CSS selector
     * @throws {Error} If document is not present
     * @throws {Error} If querySelectorAll is not present
     * @return {Array(DOMElement,)}          Elements found in the DOM
     */
    global.$ = function (selector) {
        if (typeof document === 'undefined') {
            throw new Error('document is undefined');
        }
        if (typeof document.querySelectorAll !== 'function') {
            throw new Error('document.querySelectorAll is not a function');
        }
        return document.querySelectorAll(selector);
    };

    /**
     * Extends object with another object's properties
     * @param  {Object} dest Destination
     * @param  {...Object} src Source objects
     * @return {Object}   Destination object extended with Source
     */
    global.extend = function (dest) {
        Array.prototype.slice.call(arguments, 1).forEach(function (src) {
            if (src) {
                for (var i in src) {
                    dest[i] = src[i];
                }
            }
        });
        return dest;
    };

}(window));
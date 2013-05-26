describe('utils.js - extend', function () {
    it('should extend one object with another', function () {
        var dest = {
            a: 1,
            b: 2,
            c: 3
        };
        var obj1 = {
            d: 4,
            e: 5
        };
        var obj2 = {
            f: 6,
            g: 7
        };

        var ret = extend(dest, obj1, obj2);

        expect(ret).toEqual({
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7
        });

        expect(dest).toEqual(ret);
    });

    it('should override existing properties', function () {
        var obj1 = {
            d: 4,
            e: 5
        };
        var obj2 = {
            d: 6,
            e: 7,
            f: 8
        };

        var ret = extend(obj1, obj2);

        expect(obj1).toEqual({
            d: 6,
            e: 7,
            f: 8
        });
    });
});
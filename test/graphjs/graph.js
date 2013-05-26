describe('Graphjs', function () {
    var graphjs;
    var ctx = {
        clearRect: jasmine.createSpy().andReturn()
    };
    var canvas = {
        width: 3,
        height: 3,
        getContext: jasmine.createSpy().andReturn(ctx)
    };

    beforeEach(function () {
        $ = jasmine.createSpy().andReturn([canvas]);
        graphjs = new Graphjs();
    });

    describe('init', function () {
        $ = jasmine.createSpy().andReturn([{}]);
        it('should try to initialize CTX', function () {
            spyOn(graphjs, 'initializeCtx').andReturn({});
            spyOn(graphjs, 'init').andCallThrough();

            var ret = graphjs.init();

            expect(graphjs.initializeCtx).toHaveBeenCalled();
            expect(ret).toEqual(true);
        });
    });

    describe('initializeCtx', function () {
        beforeEach(function () {
            graphjs.init();
        });

        it('should initialize 2D context', function () {
            expect(canvas.getContext).toHaveBeenCalledWith("2d");
        });

        it('should clear the canvas', function () {
            expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
        });
    });

    describe('calculateStep', function () {
        it('should return proper step', function () {
            graphjs.init({step: 1});
            expect(graphjs.calculateStep()).toEqual(1);

            graphjs.init({step: 111});
            expect(graphjs.calculateStep()).toEqual(111);

            graphjs.init({step: 0.1});
            expect(graphjs.calculateStep()).toEqual(1);
        }); 
    });

    describe('getMaxXY', function () {
        it('should return proper maximum X and Y when there\'s no offset', function () {
            graphjs.init();
            expect(graphjs.getMaxXY()).toEqual({x: canvas.width - 1, y: canvas.width - 1});
        });

        it('should return maximum X and Y when there\'s offset', function () {
            graphjs.init({offset: {x: 10, y: 10}});
            expect(graphjs.getMaxXY()).toEqual({x: -10 + canvas.width - 1, y: 10 + canvas.width - 1});
        });
    });

    describe('getMinXY', function () {
        it('should return proper minimum X and Y when there\'s no offset', function () {
            graphjs.init();
            expect(graphjs.getMinXY()).toEqual({x: 0, y: 0});
        });

        it('should return proper minimum X and Y when there\'s offset', function () {
            graphjs.init({offset: {x: 10, y: 10}});
            expect(graphjs.getMinXY()).toEqual({x: -10, y: 10});
        });
    });

    describe('getFnForMethod', function () {
        beforeEach(function () {
            graphjs.init();
        });

        it('should return function', function () {
            expect(graphjs.getFnForMethod('Math.sin')).toEqual(jasmine.any(Function));
        });

        it('should calculate function\'s value', function () {
            var pure = graphjs.getFnForMethod('Math.sin(x)', 'pure');
            for (var i = 0; i < Math.PI; i += 0.1) {
                expect(pure(i)).toEqual(Math.sin(i));
            }
        });

        it('should calculate first euler', function () {
            var euler = graphjs.getFnForMethod('x+y', 'euler');
            var h = graphjs.calculateStep();
            expect(euler(2, 4)).toEqual(4 + h * (2+4));
        });
    });

    describe('calcFunction', function () {
        it('should return array of points', function () {
            graphjs.init();
            var ret = graphjs.calcFunction('Math.sin(x)', 'pure');

            expect(ret.length).toEqual(graphjs.getMaxXY().x - graphjs.getMinXY().x + 1);
            expect(ret[0].x).toEqual(0);
            expect(ret[0].y).toEqual(Math.sin(0));

            expect(ret[1].x).toEqual(1);
            expect(ret[1].y).toEqual(Math.sin(1));

            var euler = graphjs.calcFunction('x+y', 'euler');
            expect(euler.length).toEqual(graphjs.getMaxXY().x - graphjs.getMinXY().x + 1);
            expect(euler[0].x).toEqual(0);
            expect(euler[0].y).toEqual(0 + graphjs.calculateStep() * (0 + 0));

            expect(euler[1].x).toEqual(1);
            expect(euler[1].y).toEqual(0 + graphjs.calculateStep() * (1 + 0));
        });
    });

    describe('takeCareOfAsymptotes', function () {
        it('should return array with Infities replaced with appriopriate values', function () {
            graphjs.init();
            var arr = [{x: -1, y: -1}, {x: 0, y: Infinity}, {x: 1, y: 1}];
            var ret = graphjs.takeCareOfAsymptotes(arr);
            expect(ret[1].y).not.toEqual(Infinity);
            expect(ret[1].asymptote).toEqual(true);
        });
    });
});

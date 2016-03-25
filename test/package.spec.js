'use strict';

var strategy = require('..');

/* @globals describe */
describe('passport-encored-enertalk', function () {

    it('should export Strategy constructor directly from package', function () {
        expect(strategy).to.be.a('function');
        expect(strategy).to.equal(strategy.Strategy);
    });

    it('should export Strategy constructor', function () {
        expect(strategy.Strategy).to.be.a('function');
    });

});
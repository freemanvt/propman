/**
 * Created by vinhta on 13/12/2015.
 */
"use strict";

var assert = require('chai').assert;
var propMan = require('../propman').getInstance();

describe('propMan', function() {
    describe('#loadProperty()', function () {
        propMan.loadProperty('test','propertyfile.properties');

        it('propertyfile', function() {
            assert('a_db.com' === propMan.getProperty('propertyfile.properties','db.server'), 'should return \'a_db.com\'');
            assert('_en_UK hello welcome to propname' === propMan.getProperty('propertyfile.properties','frontpage.intro'), 'should return \'_en_UK hello welcome to propname\'');
        });


    });
});
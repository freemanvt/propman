/**
 * Created by vinhta on 13/12/2015.
 */
"use strict";

var assert = require('chai').assert;
var logger = require('../logger');
var propMan = require('../propman').getInstance();

describe('propMan', function() {
    describe('#loadProperty()', function () {
        propMan.loadProperty('test','propertyfile.properties');
        logger.debug('loaded properties');

        before(function() {
            logger.debug('setup before all test');
        });

        beforeEach(function() {
            logger.debug('setup before each test');
        });


        it('propertyfile', function() {
            // test we can load and return the environment being set
            assert('en_UK' === propMan.getEnvironment(),  'should return \'en_UK\'');
            // test we can get a property from the root property file
            assert('a_db.com' === propMan.getProperty('propertyfile.properties','db.server'), 'should return \'a_db.com\'');
            // test we get a property that overwrites the root property file property
            assert('_en_UK hello welcome to propname' === propMan.getProperty('propertyfile.properties','frontpage.intro'), 'should return \'_en_UK hello welcome to propname\'');
        });

        it('substring', function() {
            // test we can substitute a value {{}}
            var actual = propMan.getProperty('propertyfile.properties','frontpage.substring', {name : 'Vinh'});
            logger.debug('actual [%s]', actual);
            assert('_en Vinh is here' === actual,  'should return \'_en Vinh is here\'');
        });


    });
});
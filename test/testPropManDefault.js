/**
 * Created by vinhta on 13/12/2015.
 */
"use strict";

var assert = require('chai').assert;
var logger = require('../logger');
var propMan = require('../propman').getInstance();

/**
 * To run these test don't pass in any environment
 */
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
            assert.equal(propMan.getEnvironment(), '', 'should return \'\'');
            // test we can get a property from the root property file
            assert.equal(propMan.getProperty('propertyfile.properties','db.server.username'), 'larry', 'should return \'larry\'');
            assert.equal(propMan.getProperty('propertyfile.properties','db.server.password'), 'ellison', 'should return \'ellison\'');
            assert.equal(propMan.getProperty('propertyfile.properties','db.server'), 'a_db.com', 'should return \'a_db.com\'');
        });

        it('substitute', function() {
            // test we can substitute a value {{}}
            var actual = propMan.getProperty('propertyfile.properties','frontpage.substring', {name : 'Vinh'});
            logger.debug('actual [%s]', actual);
            assert.equal(actual, '_en Vinh is here', 'should return \'_en Vinh is here\'');
        });


    });
});
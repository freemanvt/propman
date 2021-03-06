/**
 * Created by vinhta on 13/12/2015.
 */
"use strict";

var assert = require('chai').assert;
var logger = require('../logger');
var propMan = require('../propman').getInstance();

/**
 * To run these test you must pass in the environment variable PROPMANENV=en_UK
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
            assert.equal(propMan.getEnvironment(), 'en_UK', 'should return \'en_UK\'');
            // test we can get a property from the root property file
            assert.equal(propMan.getProperty('propertyfile.properties','db.server'), 'a_db.com', 'should return \'a_db.com\'');
            // test we get a property that overwrites the root property file property
            assert.equal(propMan.getProperty('propertyfile.properties','frontpage.intro'), '_en_UK hello welcome to propname', 'should return \'_en_UK hello welcome to propname\'');
        });

        it('substitute', function() {
            // test we can substitute a value {{}}
            var actual = propMan.getProperty('propertyfile.properties','frontpage.substring', {name : 'Vinh'});
            logger.debug('actual [%s]', actual);
            assert.equal(actual, '_en Vinh is here', 'should return \'_en Vinh is here\'');
            actual = propMan.getProperty('propertyfile.properties','frontpage.blurb', {colour : 'brown', animal: 'fox', animal2: 'dog'});
            logger.debug('actual [%s]', actual);
            assert.equal(actual, 'The quick brown fox jumped over the lazy dog', 'should return \'The quick brown fox jumped over the lazy dog\'');
        });


    });
});
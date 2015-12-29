/**
 * Created by vinhta on 13/12/2015.
 */
"use strict";

var assert = require('chai').assert;
var logger = require('../logger');
var propMan = require('../propman').getInstance('en_UK_PROD2');

describe('propMan', function() {
    describe('#loadProperty()', function () {
        propMan.loadProperty('test','appConfig.properties');
        logger.debug('loaded properties');

        before(function() {
            logger.debug('setup before all test');
        });

        beforeEach(function() {
            logger.debug('setup before each test');
        });


        it('appConfig.properties property file', function() {
            // test we can load and return the environment being set
            assert.equal(propMan.getEnvironment(),'en_UK_PROD2',  'should return \'en_UK_PROD2\'');

            // test we can retrieve the button label
            assert.equal(propMan.getProperty('appConfig.properties','button1'), 'submit', 'should return \'submit\'');
            assert.equal(propMan.getProperty('appConfig.properties','button2'), 'signin', 'should return \'signin\'');

            // test we get the right db url
            assert.equal(propMan.getProperty('appConfig.properties','db.url'), 'prod2.db.foo.com', 'should return \'prod2.db.foo.com\'');

        });


    });
});
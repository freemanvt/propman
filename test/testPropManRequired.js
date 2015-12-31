/**
 * Created by vinhta on 13/12/2015.
 */
"use strict";

var assert = require('chai').assert;
var logger = require('../logger');
var propMan = require('../propman').getInstance('en_UK');
var RequiredPropertyNotSetError = require('../RequiredPropertyNotSetError');

/**
 * To run these test you must pass in the environment variable PROPMANENV=en_UK
 */
describe('propMan', function() {
    describe('#loadProperty()', function () {

        it('test required properties', function() {
            // tests for if the user set required properties in the properties file that it is flagged and the app exit

            // load the properties file that has {{{required}}} value
            // this should throw a RequiredPropertyNotSetError
            assert.throw(function () {
                propMan.loadProperty('test','shouldthrowerror.properties');
            }, RequiredPropertyNotSetError);

            // load the properties file that hasn't got {{{required}}} value and shouldn't throw an error
            assert.doesNotThrow(function() {
                propMan.loadProperty('test','shouldnotthrowerror.properties')
            }, RequiredPropertyNotSetError);

            // test there are {{{required}}} values loaded
            assert.equal(propMan.hasRequiredNotSet('shouldthrowerror.properties'),true, 'should return true as there are {{{required}}} values');

            // test there are no {{{required}}} values loaded from shouldnotthrowerror.properties
            assert.equal(propMan.hasRequiredNotSet('shouldnotthrowerror.properties'),false, 'should return false as there are no {{{required}}} values');

            // test we have the right type of error
            try {
                propMan.loadProperty('test','shouldthrowerror.properties');
            } catch (err) {
                logger.error('error ' + err);
                assert(err.constructor === RequiredPropertyNotSetError);
                logger.debug(JSON.stringify(err.extra));
            }

            // test that has overriding properties where the root one is required and the overriding one is valid, shouldn't throw an exception
            assert.doesNotThrow(function() {
                propMan.loadProperty('test','shouldnotthrowerror2.properties')
            }, RequiredPropertyNotSetError);


        });


    });
});
/**
 * Property Manager helps you load and manage application properties such as configuration properties or localization properties.
 *
 * Created by vinhta on 13/12/2015.
 */
"use strict";

var logger = require('./logger');
var fs = require('fs');
var PropertiesReader = require('properties-reader');
var _ = require('lodash');
var RequiredPropertyNotSetError = require('./RequiredPropertyNotSetError');


var PropMan = (function PropertyManager() {

    // our singleton instance
    var instance;

    function createInstance(env) {

        // property to hold all our loaded properties by filename
        var propertiesMap = {};

        // user set or runtime environment variable for PROPMANENV e.g. PROPMANENV=en_UK_PROD1 node app.js
        var environment;
        if (env) {
            environment = env;
        } else if (process.env.PROPMANENV) {
            environment = process.env.PROPMANENV;
        } else {
            environment = ''; // default
        }
        logger.debug('property environment [' + environment + ']');

        // use to hold all the environment variable combination e.g. en, en_UK, en_UK_PROD1
        var propertyEnvVariables = [];

        function loadPropertyEnvVariables() {
            var propmanEnvArray = environment.split('_');
            var runningEnv = '';
            if (propmanEnvArray.length > 1) {
                propmanEnvArray.forEach(function(value) {

                    if (propertyEnvVariables.length === 0) {
                        runningEnv += value;
                    } else {
                        runningEnv += '_' + value;
                    }
                    propertyEnvVariables.push(runningEnv);
                    logger.debug('loaded ' + runningEnv);
                });
            } else {
                propertyEnvVariables.push(environment[0]);
            }
        }

        loadPropertyEnvVariables();


        // public method
        return {

            /**
             * Get the environment which was pass when the script loaded via PROPMANENV
             * @returns {*}
             */
            getEnvironment : function () {
                return environment;
            },

            /**
             * check the loaded properties loaded for filename and see if any has {{{required}}} as a value
             *
             * @param filename
             * @returns {boolean}
             */
            hasRequiredNotSet : function(filename) {
                var properties = propertiesMap[filename];
                if (_.indexOf(_.values(properties._properties), '{{{required}}}' ) === -1) {
                    return false;
                };
                return true;
            },

            /**
             * Load the specified property file, if any of the properties after they been loaded has a value of {{{required}}}
             * a RequiredPropertyNotSetError error will be thrown. The caller will need to deal with the error or it will be
             * an uncaught
             *
             * @param dir
             *      Directory the properties files are in
             * @param filename
             *      Property file name to load
             * @throws
             *      RequiredPropertyNotSetError error when after loading any of the property has a value of {{{required}}}
             */
            loadProperty : function(dir, filename) {

                // load the default property file first
                var localfilename;
                if (dir) {
                    localfilename = dir + '/' + filename;
                } else {
                    localfilename = filename;
                }

                logger.info('loading property file [' + localfilename + ']');
                var properties = PropertiesReader(localfilename);
                if (propertyEnvVariables.length > 1) {
                    propertyEnvVariables.forEach(function (value) {
                        var f = localfilename + '_' + value;
                        try {
                            logger.info('loading property file [' + f + ']');
                            properties.append(f);
                        } catch (err) {
                            logger.warn('can\'t load %s', f);
                        }
                    });
                }

                propertiesMap[filename] = properties;

                if(this.hasRequiredNotSet(filename)) {
                    var requiredNotSet = {};
                    // let's get all properties that hasn't been set
                    _.forOwn(properties._properties, function(value, key) {
                        if (value === '{{{required}}}') {
                            requiredNotSet[key] = value;
                        }
                    });

                    // throw error
                    throw new RequiredPropertyNotSetError('filename [' + filename + '] has required properties not set', requiredNotSet);
                }

            },

            /**
             * Get the property value
             *
             * e.g.
             * propertyfile.properties_en
             * =========================================
             * frontpage.intro=_en hello welcome to propname
             * frontpage.footer=_en normal footer
             * frontpage.substring=_en {{name}} is here
             *
             * @param filename
             *  file which the property was specified in
             * @param property
             *  name of the property e.g. frontpage.intro
             * @param replacementMap
             *  if not passed in, it will return the value that matches that property.
             *  if passed in, it will replace any replacer text {{}} with a matching value keyed by what is between {{ and }}.
             *  e.g. if the property was "frontpage.substring=_en {{name}} is here", and you call getProperty and pass in a map {name: "Vinh"}
             *  returned will be "_en Vinh is here"
             * @returns {*}
             */
            getProperty : function(filename, property, replacementMap) {
                logger.debug('filename [' + filename + ']');
                logger.debug('property [' + property + ']');
                var properties = propertiesMap[filename];
                var propertyExtracted = properties.get(property);
                if (replacementMap) {
                    var r = '';
                    _.each(propertyExtracted.split(' '), function replaceValue (value, index, arr) {
                        if (value.indexOf('{{') != -1) {
                            r += replacementMap[value.substring(2, value.length - 2)];
                        } else {
                            r += value;
                        }
                        if (index < arr.length - 1) {
                            r += ' ';
                        }
                    });
                    return r;

                } else {
                    return propertyExtracted;
                }
            }

        };
    }

    return {
        getInstance: function (env) {
            if (!instance) {
                instance = createInstance(env);
            }
            return instance;
        }
    };

})();

module.exports = PropMan;

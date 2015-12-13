/**
 * Created by vinhta on 13/12/2015.
 */
"use strict";

var logger = require('./logger');
var fs = require('fs');
var PropertiesReader = require('properties-reader');

var PropMan = (function PropertyManager() {

    // our singleton instance
    var instance;

    function createInstance() {

        // property to hold all our loaded properties by filename
        var propertiesMap = {};

        // runtime environment variable for PROPMANENV e.g. PROPMANENV=en_UK_PROD1 node app.js
        var environment = process.env.PROPMANENV;
        logger.debug('property environment [' + environment + ']');

        // use to hold all the environment variable combination e.g. en, en_UK, en_UK_PROD1
        var propertyEnvVariables = [];

        function loadPropertyEnvVariables() {
            var propmanEnvArray = environment.split('_');
            var runningEnv = '';
            propmanEnvArray.forEach(function(value) {

                if (propertyEnvVariables.length === 0) {
                    runningEnv += value;
                } else {
                    runningEnv += '_' + value;
                }
                propertyEnvVariables.push(runningEnv);
                logger.debug('loaded ' + runningEnv);
            });
        }

        loadPropertyEnvVariables();


        // public method
        return {

            loadProperty : function(dir, filename) {
                // load the default property file first
                var localfilename = dir + '/' +filename;
                logger.info('loading property file [' + localfilename + ']');
                var properties = PropertiesReader(localfilename);

                propertyEnvVariables.forEach(function (value) {
                    var f = localfilename + '_' + value;
                    logger.info('loading property file [' + f + ']');
                    properties.append(f);
                })

                propertiesMap[filename] = properties;

            },

            getProperty : function(filename, property) {
                logger.debug('filename [' + filename + ']');
                logger.debug('property [' + property + ']');
                var properties = propertiesMap[filename];
                return properties.get(property);
            }

        }
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };

})();

module.exports = PropMan;

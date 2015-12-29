# propman
Simple property and config manager that allows you to load up your properties files and hierarchical variations of those 
properties files specific to individual environments. Can be used when you want to keep the management of your properties 
simple and local to the code instead of using external tools. 

Can also be used for loading up text for internalization. 

## Example 1
You have two servers that you deploy your code to; PROD1 and PROD2. Both servers might need to point to different 
database instances. Both servers also share common properties like labels for form buttons.

appConfig.properties
------------------------
db.url=dev.db.foo.com

appConfig.properties_en_UK
------------------------
button1=submit
button2=signin<br />

appConfig.properties_en_UK_PROD1
------------------------
db.url=prod1.db.foo.com

appConfig.properties_en_UK_PROD2
------------------------
db.url=prod2.db.foo.com

In your node code, you do

```javascript
var propMan = require('./propman').getInstance();
propMan.loadProperty('./directory/to/properties','appConfig.properties');

var dbServer = propMan.getProperty('appConfig.properties','db.url');
```

You can then use the following environment variable 

PROPMANENV

to load the properties file specific to the environment your code is running on. So for PROD1 we can start the node instance as

PROPMANENV=en_UK_PROD1 node server.js

And this will load up the following properties files

appConfig.properties<br />
appConfig.properties_en_UK<br />
appConfig.properties_en_UK_PROD1<br />

And the following properties value

db.url=prod1.db.foo.com<br />
button1=submit<br />
button2=signin<br />

On PROD2 we would pass in PROPMANENV=en_UK_PROD2 which would then load

appConfig.properties<br />
appConfig.properties_en_UK<br />
appConfig.properties_en_UK_PROD2<br />

with the following properties being loaded

db.url=prod2.db.foo.com<br />
button1=submit<br />
button2=signin<br />

## Example 2
You want to test the code locally on your development laptop but want to test it against a TEST database and a UAT database, 
maybe for troubleshooting or debugging

appConfig.properties
------------------------
db.url=dev.db.foo.com

appConfig.properties_en_UK_TEST
------------------------
db.url=test.db.foo.com

appConfig.properties_en_UK_UAT
------------------------
db.url=uat.db.foo.com

You can then use 

PROPMANENV=en_UK_TEST to load up the TEST db.url which  will give you test.db.foo.com<br />
PROPMANENV=en_UK_UAT to load up the UAT db.url which will give you uat.db.foo.com

If you don't pass in any environment variable you will get the default which will be dev.db.foo.com

## Example 3
You have a piece of text with word/s that need to be substituted by runtime value. You can specify runtime value substitution using {{}}

e.g.

frontpage.blurb=The quick {{colour}} {{animal}} jumped over the lazy {{animal2}}

Then in your code you can pass in a map that contains the actual value to put in.

```javascript
var text = propMan.getProperty('propertyfile.properties','frontpage.blurb', {colour : 'brown', animal: 'fox', animal2: 'dog'});
```

You will end up with the text

The quick brown fox jumped over the lazy dog

## Extra
you can also pass in the PROPMANENV environment programmatically

```javascript
var propMan = require('./propman').getInstance('en_UK_PROD1');
```




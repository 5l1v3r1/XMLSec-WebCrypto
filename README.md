# XMLSec-WebCrypto
An implementation for the XML Security Standard using the W3C WebCrypto API

## How to use
Use the [distributable file](https://github.com/RUB-NDS/XMLSec-WebCrypto/blob/master/dist/xmlsec-webcrypto.js) and include it in your HTML header.
See [here](https://github.com/RUB-NDS/XMLSec-WebCrypto/blob/master/test/index.html#L9) for an example.

## How to compile
The steps have been tested with Ubuntu:

1. Install Node.js and npm:

       `# apt-get install npm`
1. Ubuntu calls node's binary `nodejs`, but `node` is more common:

       `# ln -s /usr/bin/nodejs /usr/bin/node`
1. Install Coffeescript: 

       `# npm install -g coffee-script`
1. Compile package info: 

       `$ cake package`
1. Install dependencies: 

       `$ npm install`

       `$ npm update`
1. Compile code: 

       `$ cake build`

module.exports =
  name: "XMLSec-WebCrypto"

  version: "0.1.0"
  description: "An implementation for the XML Security Standard using the W3C WebCrypto API"
  
  homepage: "https://github.com/RUB-NDS/XMLSec-WebCrypto"

  author: "Martin Becker"

  #dependencies:
  
  devDependencies:
    "http-server": ">= 0.8.5"
    jquery: ">=1.9.0"
    "coffee-script": ">=1.10.0"
    "xml-c14n": ">=0.0.6"
    xpath: ">=0.0.23"
    browserify: "~13"
    "uglify-js": "~2.7"
    mkdirp: "*"
    
  engine: "node >= 0.6"

  scripts:
    build: "cake build"
    start: "node ./node_modules/http-server/bin/http-server ./"

  licenses: [
    type: "MIT"
  ]

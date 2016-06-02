module.exports =
  name: "XMLSec-WebCrypto"

  version: "0.1.0"
  description: "An implementation for the XML Security Standard using the W3C WebCrypto API"
  
  homepage: "https://github.com/RUB-NDS/XMLSec-WebCrypto"

  author: "Martin Becker"

  #dependencies: 
  
  devDependencies:
    "coffee-script": ">=1.10.0"
    "http-server": ">= 0.8.5"
    
  engine: "node >= 0.6"

  scripts:
    build: "cake build"
    start: "node ./node_modules/http-server/bin/http-server ./Prototype/"

  licenses: [
    type: "MIT"
  ]

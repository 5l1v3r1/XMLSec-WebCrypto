###
Class as Container for all required Parameters for Encryption
###
class window.EncryptionParams
  @symKey=""
  @asymKey=""
  @asymKeyName=""
  @withKeyInfo=""
  @staticIV=false
  @prefix=""
  @references=""
  @algIdentifer =""
  @asymAlgIdentifier = ""
  @keyLength=""
  @keyInfoPrefix=""
  ###
  ###
  constructor:()->
    @staticIV = false

  ###
  Sets the symmetric key objekt and selects the Algorithm URI with the information from the key
  ###
  setSymmetricKey:(symKey)->
    if symKey
      @symKey = symKey
      @algIdentifer = XMLSecEnum.AlgIdentifiers[symKey.algorithm.name.replace("-","")+symKey.algorithm.length]
      @keyLength = symKey.algorithm.length
      if !@algIdentifer or @algIdentifer ==""
        throw new Error "Algorithm not supported:"+algIdentifer

    return @symKey
  ###
  Sets the public key for the keywrapping within the encryption. The name can be choosen. Sets furthermore the URI.
  ###
  setPublicKey:(publicKey,keyName) ->
    if publicKey
      @asymKey = publicKey
      @withKeyInfo = true
      @asymKeyName = keyName
      @asymAlgIdentifier = XMLSecEnum.AlgIdentifiers[publicKey.algorithm.name.replace("-","")]
      if !@asymAlgIdentifier or @asymAlgIdentifier ==""
        throw new Error "Algorithm not supported:"+asymAlgIdentifier
    return @asymKey
  ###
  Sets the prefix for the xml elements. The prefix is optional
  ###
  setPrefix:(prefix)->
    if prefix != ""
      #is there a :
      if prefix.indexOf(":") == -1
        @prefix = prefix+":"
      else
        @prefix = prefix

  ###
  Sets the prefix for the xml elements. The prefix is optional
  ###
  setKeyInfoPrefix:(prefix)->
    if prefix != ""
      #is there a :
      if prefix.indexOf(":") == -1
        @keyInfoPrefix = prefix+":"
      else
        @keyInfoPrefix = prefix
  ###
  Forces a static IV. USE ONLY FOR TESTING
  ###
  setStaticIV:(staticIV)->
    @staticIV = staticIV

  ###
  Sets the References
  ###
  setReferences:(references)->
    @references = references

  ###
  creates an object containig all relevant infomation
  ###
  getEncryptionInfo:() ->
    encryptionInfo = {
      symKey:@symKey,
      keyLength:@keyLength,
      asymKey:@asymKey,
      asymKeyName:@asymKeyName,
      withKeyInfo:@withKeyInfo,
      staticIV:@staticIV,
      prefix:@prefix,
      references:@references,
      algIdentifer:@algIdentifer,
      asymAlgIdentifier:@asymAlgIdentifier,
      keyInfoPrefix:@keyInfoPrefix
    }

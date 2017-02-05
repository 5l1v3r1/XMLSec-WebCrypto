###
Wrapper-Class for Web Crypto API function calls
###
class window.CryptoWrapper

  constructor: () ->
  ###
  Create a Signature
  input: serialized node
  signatureParams: SignaturParams Object
  ###
  @Sign : (input,signatureParams) ->
    # Parse input into an arrayBuffer
    buffer = new TextEncoder("utf-8").encode(input)
    window.crypto.subtle.sign(
      {
        name: signatureParams.signAlg.name, # SignaturAlgorithm-Name (e.g. RSA)
        hash:{name:signatureParams.hash} # DigestAlgorithem-Name (e.g. SHA1)
      },
      signatureParams.privateKey, # signing key
      buffer # this will be signed
      )
    .then((signature) ->
        # Parse arrayBuffer into a base64 encoded string
        return Helper.arrayBufferToBase64(signature)
      )
  ###
  Signature verification
  input: serialized xml node that has to be verified
  publicKey: verifing key
  signatureParams: SignaturParams Object
  ###
  @Verify : (input,publicKey,signatureParams) ->
    #P arse input into an arrayBuffer
    buffer = new TextEncoder("utf-8").encode(input)
    # parse the base64 encoded signaturevalue in to an ArrayBuffer
    signatureValueBuffer = Helper.base64ToArrayBuffer(signatureParams.signatureValue)

    window.crypto.subtle.verify(
      {
        name: signatureParams.signAlg.name, # SignaturAlgorithm-Name (e.g. RSA)
        hash:{name:signatureParams.signAlg.name} # DigestAlgorithem-Name (e.g. SHA1)
      },
      publicKey, # verifying Kex
      signatureValueBuffer, # signaturevalue to verify
      buffer # data that has to be verified

      )
    .then((signature) ->
        # return true or false
        return signature
      )

  ###
  wraps a symmetric key with an asymetric key
  symKey: symmetric key thats gone be wrapped
  asymKey: asymetric key used to wrap the symmetric key
  ###
  @WrapKey : (symKey,asymKey) ->
    window.crypto.subtle.wrapKey(
      "raw", # to which format will the symetric key be exported
      symKey, # the symmetric key
      asymKey, # the asymetric kex
      {
        name: asymKey.algorithm.name # name of the asymetric algorithem (e.g. RSA-OAEP)
        hash: {name: asymKey.algorithm.hash.name}# name of the digest algorithm (e.g. SHA1)
      }
    )
    .then((wrappedKey)->
      # parse the wrapped key ArrayBuffer into a base54 encoded string
      return Helper.arrayBufferToBase64(wrappedKey)
      )
    .then(null,(err)->
      console.error(err)
    )
  ###
  unwraps an wrapped key
  encKey: The wrapped symmetric key
  asymKey: The asymetric key to unwrap the wrapped key
  symKeyAlg: The symetric algorithm belonging to the wrapped key
  ###
  @UnWrapKey : (encKey,asymKey,symKeyAlg)  ->
    #parse the wrapped key base64 string into an arrayBuffer
    encKey = Helper.base64ToArrayBuffer(encKey)
    window.crypto.subtle.unwrapKey(
      "raw", # Format of the wrapped key
      encKey, # The warpped key
      asymKey,# The asymmetric key
      {
        name:asymKey.algorithm.name, # name of the asymmetric algorithm (e.g. RSA-OAEP)
        hash: {name: asymKey.algorithm.hash.name}, # name of the digest method
      },
      {
        name:symKeyAlg # name of the symmetric algorithm from the wrapped key
      },
      false, # is the symmetric key extractable
      ["encrypt", "decrypt"] # functions of the symmetric key
    )
    .then((key)->
      # return the symmetric key as an Web Crypto API key objekt
      return key
      )
    .then(null,(err)->
      console.error(err)
    )

  ###
  Prerforms the AES Encryption
  input: The nodeset to encrypt
  key: The symmetric key
  staticIV: If true, the Encryption Method will use an IV initialsed with "0" instead of an random value. USE ONLY FOR TESTING!
  ###
  @Encryption:(input,key,staticIV)->
    mode = key.algorithm.name # extract the name of the key's algorithem (e.g. AES-CBC)
    nodeType = input.nodeType # reads the node Type of the input to determain if it is an Element or Content
    input = new XMLSerializer().serializeToString(input) # serialize the XML-Node Set
    buffer = new TextEncoder("utf-8").encode(input) # convert the string into an arrayBuffer
    #If the mode of Operation is "AES-GCM" create the IV with 12 byte an fill it with random values
    if mode =="AES-GCM"
      IV = window.crypto.getRandomValues(new Uint8Array(12))
    #If not, create an IV with 16 byte an fill it with random values
    else
      IV = window.crypto.getRandomValues(new Uint8Array(16))
    # If the staticIV flag is true, overwrite the IV with "0"
    #USE ONLY FOR TESTING
    if staticIV
      IV= IV.fill(0)
    #call the Web Crypto API encryption method
    window.crypto.subtle.encrypt(
      {
          name: mode, # algorithm an mode of operation (e.g. AES-CBC)
          iv: IV # the IV
      },
      key, # the encryption key
      buffer # data to be encrypted
    )
    .then((encrypted)->
      #put the IV and the encrypted data together
      encrypted = Helper.concatArrayBuffers(IV,encrypted)
      #encode the data to base64
      return result=[Helper.arrayBufferToBase64(encrypted),nodeType]
    )

  ###
  Method to bypass the Web Crypto / XML Encryption incompatible padding.
  Web Crypto only supports PKCS#7 Padding but XML Encryption expect ISO 10126 Padding.
  This method appends a new padding block with "16" to the chipher text.
  The original ISO 10126 Padding becomes a part of the plaintext and must be removed later.
  buffer: The original buffer with ISO 10126 padding
  key: The encryption key
  ###
  @AES_ModifyPadding:(buffer,key)->
    modifiedPadding = ""
    mode = key.algorithm.name # extract the name of the key's algorithem (e.g. AES-CBC)
    lastBlock = buffer.slice(buffer.byteLength-16,buffer.byteLength) #extract the last block from the original chipher text for use as IV
    # create a new 16 byte long array containing only "16" as new padding for the Web Crypto API
    newPadding = new Uint8Array(16)
    newPadding.fill(16)
    # encrypt the new block with the key an the last block from the original chipher text as IV
    window.crypto.subtle.encrypt(
      {
          name: mode, # the algorithm an mode of operation
          iv: lastBlock # the last block from the original chipher text as IV
      },
      key, # the key
      newPadding # the "16" block as data to encrypt
    )
    .then((newLastBlock)->
      # append the encrapted "16" block to the original chiper text
      # now there is a padding that the Web Crypto API understands
      Helper.concatArrayBuffers(buffer,newLastBlock)
      )

  ###
  decrypt an ciphertext
  input: The ciphertext
  key: The symmetric decryption key
  ###
  @Decryption:(input,key)->
    mode = key.algorithm.name # extract the name of the key's algorithem (e.g. AES-CBC)
    buffer = Helper.base64ToArrayBuffer(input)# convert the base64-string into an arrayBuffer
    #remove the IV from the buffer and save it
    if mode =="AES-GCM"
      IV= buffer.slice(0,12)
      buffer = buffer.slice(12,buffer.byteLength)
    else
      IV= buffer.slice(0,16)
      buffer = buffer.slice(16,buffer.byteLength)
    IV = new Uint8Array(IV)
    #If the aglorithm is "AES-CBC" the padding must be modified
    if mode == "AES-CBC"
      @AES_ModifyPadding(buffer,key) # modify padding
      .then((newBuffer)->
        #decrypt the chipher text with the modified paddinf
        window.crypto.subtle.decrypt(
          {
              name: mode, # algorithm an mode of operation
              iv: IV # the iv
          },
          key, # the decryption key
          newBuffer # the chipher text with modified paddinf
        )
        .then((decrypted)->
          #remove the padding
          #first remove the additional "16" block
          decrypted = decrypted.slice(0,decrypted.byteLength-16)
          #create an array from the arrayBuffer
          decryptedArray = new Uint8Array(decrypted)
          #read the last byte from the array to determain the original padding
          padding = decryptedArray[decryptedArray.length-1]
          #in case of the last byte is bigger then 16 there is no padding to be removed
          if padding <= 16
            #remove the origial padding
            decrypted = decrypted.slice(0,decrypted.byteLength-padding)
          #return the decrypted message
          decrypted = String.fromCharCode.apply(null, new Uint8Array(decrypted))
        )
        .then(null,(err)->
          console.error(err)
        )
      )
    else
      #if the mode is not "AES-CBC" decryspt without modified padding
      window.crypto.subtle.decrypt(
        {
            name: mode, # algorithm an mode of operation
            iv: IV # the iv
        },
        key, # the decryption key
        buffer # the chipher text
      )
      .then((decrypted)->
        #retrun the decrypted message
        return String.fromCharCode.apply(null, new Uint8Array(decrypted))
      )
      .then(null,(err)->
        console.error(err)
      )

  ###
  performs a hash operation
  input: the data to hash
  algorithm: the hash algorithm to use
  ###
  @hash : (input,algorithm) ->
    buffer = new TextEncoder("utf-8").encode(input) # convert the input string into an arrayBuffer
    #call the Web Crypto API digest method with the algorithm an the data
    crypto.subtle.digest(algorithm,buffer)
    .then((digest)->
      #convert the result into a base64 string an return it
      Helper.arrayBufferToBase64(digest)
      )
    .then( null, (err) ->
      return err)

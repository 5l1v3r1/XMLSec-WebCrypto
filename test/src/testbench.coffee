RSAOAEP_Enc = ""
RSAOAEP_Dec = ""
RSASSA_Ver = ""
RSASSA_Sign = ""
AES128Key = ""
AES256Key = ""
HMAC = ""
Keys = []
PlainDocument = ""
documentRoot = "./test/Documents"
refenceDocument = "/Original_XML/Minimal.xml"
refenceDocument2 = "/Original_XML/Minimal_2.xml"
refenceDocument3 = "/Original_XML/Minimal_Full_ID.xml"

TransformIdentifiers = {
  envSig : "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
  c14n : "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
}

DigestAlgIdentifiers = {
  SHA1 : "http://www.w3.org/2000/09/xmldsig#sha1"
}

SignaturAlgorithemIdenifiers = {
  RSASHA1 : "http://www.w3.org/2000/09/xmldsig#rsa-sha1"
}

$(document).ready ->
  $("#RunTest").click(RunTest)
  $("#selectAll").click(selectAll)
  $("#deselectAll").click(deselectAll)
  $("#exportKey").click(exportKey)
  console.log("DOM is ready")
  resetResults()
  loadKeys()
  .then(()->

    )

exportKey = ()->
  key = window.RSAOAEP_Dec
  window.crypto.subtle.exportKey("jwk",key)
  .then((exportedKey)->
    console.log exportedKey
    )

selectAll=()->
    $(".CBTestsE").prop("checked",true)
    $(".CBTestsD").prop("checked",true)
    $(".CBTestsDI").prop("checked",true)
    $(".CBTestsS").prop("checked",true)
    $(".CBTestsV").prop("checked",true)
    $(".CBTestsVN").prop("checked",true)
    $(".CBTestsVD").prop("checked",true)
    $(".CBTestsSD").prop("checked",true)


deselectAll=()->
    $(".CBTestsE").prop("checked",false)
    $(".CBTestsD").prop("checked",false)
    $(".CBTestsDI").prop("checked",false)
    $(".CBTestsS").prop("checked",false)
    $(".CBTestsV").prop("checked",false)
    $(".CBTestsVN").prop("checked",false)
    $(".CBTestsVD").prop("checked",false)
    $(".CBTestsSD").prop("checked",false)

loadKeys = () ->
  Raw = []
  #AES 128
  Raw.push(Helper.base64ToArrayBuffer("1SGU0rzAg2MOXTwOskSpyg=="))
  #AES 256
  Raw.push(Helper.base64ToArrayBuffer("BQVdjWk1XFdbRCET3VU5BZqCIQqNIazsuCn/W/xACdM="))
  #RSA 2048 SHA256 Private
  Raw.push(Helper.base64ToArrayBuffer("MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCbm2m+gBVV0U5QziTphNkIDhjawzMMg483AsFWDq0v7EhmPddgP+5gHx5nC6hHz/ckOHeDR06Ck+PvHESGuP6iZKZtzDSq4xnkfrW6/cUvSIpWIH+b0Am2VsEG5d2AyYVyxNPaoc26It80ugpkVPICvnwFAawhHcHha8j3EWUiJ005UkoA8XmX5336ZqRV/X6AFlyuJ1YwKGQmxDKYMMCoSbJYlK91x04dhW0BQEzlujobWdlDAq4kCiOFUhgQz9Ft/fvkNTkpYcxM0lTHjJFortp4VzWe92NGFsIubX1KKgoyiXwoPR2rIoA60VMwUoKNf6YlSC1ozKOyHX0SCDADAgMBAAECggEAQECDAGM47A+aC+mi+j2dtCLGBoa1bIRiPW/IzzUONAyXtIfyh86+KjiPQDNjEAwCW5VpW+60r1xLsO72KL74faubwRih4rIVffEILyccJbMJVBjlODxF1mGqIKQHu2b60HIPnGZVYXeGvOnY4qbkq1dmNFcFcUMtTFxKRiKLpPb6c3D3OU3KyrPGjeLlkCPmyLDXR0ZSEnmVJlpiY4OGDcbgc+Bp7uQs6pzcz+vserzmVqCo8jpfIefj/rikVeo2GNIGaSOFnHjrWuu9qXpjE+TTpMwg3bTBmBDyCPqYWqo1Fwzq9cv1J/HerAW6e9tkmIdeZ420u6D407IyQ1QZwQKBgQDSIpXROw3W3pkDzpH79646Lwg5HLTqAU219UvUfK0YrTcoZ1WKmvA0I3QlexjVN6e8EonyFvCjkOczgpXvf9W6HRXQ/YOd6eGAo2O9ftU7wDwqk0FKRd52tdPXZqS8TNAR9/XmvWEp6v8Nuc7Cyq4cqjhibUvW76mxKWZnAVSp4wKBgQC9kgt3gyN2S2TFtDQPAp4soeLNbsn2kUL0DBtvFt7FRDMgchDzucHYr2aktUl0MUCBbPTz7Olqi4B/u3m1yn+ogm3ua86+9cOYrZfx7cG521gjDmtDHGx96QoW2xOsvhiJUOln2cx0+f8J+IQKLlIU0L8RZq85yXcP97Nxxqm7YQKBgQCikMkQpjwNqAX+sPe1U6cBMlONQ40en8WL6GoyyAVt2suaQV8nLLh5zZfUS0gp47WrRThdBqxCDh8fdX4jW+Vv54JyPT5uk3q2dzD5b77tS8oAMg3HtQfnFMH/mVQGrPInhIpDaO1bbYbGCqJPhlduq62VT/LlJGJGQb4MIDZsewKBgDwZVetQtuhk5JDNHYf4s37A3+9zBTJXQRuvzu68GGn/whmyL++k33C7wtXK53uftaySh2HhpOpzSYy1OdPJXAlnOETTBtuBfL4lors/PiCXCm0qwBSpqTeNrvYqBCXKqmq2LRkQcoJPU2yszeeQYdNZjomMvVabqVR1mf0jF2JhAoGANbJIGcWnmzEJaOathYGGsWJdGgQBChOy6k2XyLvEVtEKfVmlX2asaflC9ick5XSFvcpuiK1XWpo8Pw4QD3f4nABE0Ll7LeEoAnbkPrYhduWvpLmSa9+0UIJ19vLcfuDUZ+cS0gT+8fxOfv1yqZMn5szyLs3tDFoxzh3tpqNzcKI="))
  #RSA 2048 SHA256 Public
  Raw.push(Helper.base64ToArrayBuffer("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm5tpvoAVVdFOUM4k6YTZCA4Y2sMzDIOPNwLBVg6tL+xIZj3XYD/uYB8eZwuoR8/3JDh3g0dOgpPj7xxEhrj+omSmbcw0quMZ5H61uv3FL0iKViB/m9AJtlbBBuXdgMmFcsTT2qHNuiLfNLoKZFTyAr58BQGsIR3B4WvI9xFlIidNOVJKAPF5l+d9+makVf1+gBZcridWMChkJsQymDDAqEmyWJSvdcdOHYVtAUBM5bo6G1nZQwKuJAojhVIYEM/Rbf375DU5KWHMTNJUx4yRaK7aeFc1nvdjRhbCLm19SioKMol8KD0dqyKAOtFTMFKCjX+mJUgtaMyjsh19EggwAwIDAQAB"))
  #RSA 2048 SHA1 Public
  Raw.push(Helper.base64ToArrayBuffer("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv0kIIStBP1QppqgtHj+fENpEx6ktFa8750n3oMpN1aA+3fRA5cnokWCBaxHCR8cZN6dF5gYd4b9MrY5pckdPwPMNelIbDnzVlmZ9e40xSY+eYkoUdSzc3O6Z0QOyJ6brTyFdPi1B15SOTflxntD14Yh7JcH4rS1UEEVwBKz/j8JzeJbno2V3xX+iI0he8Y/0tF5FcmzzpCAskDVsSL/o/OLBDcOrTc8RSxo/EAhPMc9fBqgNm2yNvB57BjP7NkphpVrPO4RXyQtv13YMBzfNqt4q2DQEQKYwyPulazqwZLJ7FBRAqcdHm2r64NhVs//awvQXA9ibyke9KkB3B45LuwIDAQAB"))
  #RSA 2048 SHA1 Private
  Raw.push(Helper.base64ToArrayBuffer("MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC/SQghK0E/VCmmqC0eP58Q2kTHqS0VrzvnSfegyk3VoD7d9EDlyeiRYIFrEcJHxxk3p0XmBh3hv0ytjmlyR0/A8w16UhsOfNWWZn17jTFJj55iShR1LNzc7pnRA7InputPIV0+LUHXlI5N+XGe0PXhiHslwfitLVQQRXAErP+PwnN4luejZXfFf6IjSF7xj/S0XkVybPOkICyQNWxIv+j84sENw6tNzxFLGj8QCE8xz18GqA2bbI28HnsGM/s2SmGlWs87hFfJC2/XdgwHN82q3irYNARApjDI+6VrOrBksnsUFECpx0ebavrg2FWz/9rC9BcD2JvKR70qQHcHjku7AgMBAAECggEACI7H4lQBE0g8pMwZWKUYBLT/Jr+W2MWCNJLGlVb3rHsC1QM8dAtYcEiVAalFu9hYdHjzU5sqcxMP5yPb69Ts6ID3NWW++CL1m0jyjDiA3/2g5FzUFXnwV6IFF6jGq6d4F44ykbmMnIx04WAriSNoHLLyb3oCGh1RCXlRzaO/uzqwAKWsnUs5I8RjwA4zVbNRos3z0vjep/5R7aMC/xr0RG6llzgVWnXE+q6pfKuvyJmj4B7sQx2G6NcAOm6qst6XO5x0JRj+yiKjveIKn9u7HRWZcs1LhNIkuq3mV9X52JOkutPWGNa40LMKmqyhtPUvAg9b2TP4WIyqj2yvoxjYYQKBgQDr0o3WwkCNimPgElF4ZaTqr7MiAbilSVjzwuFSWemSyzMFqClq2DCSxUgPaAvt8bKFI2joyuX8wvVEDq5BUf9ODPS4qlomh+rD2qPpK34gLm2e8mXDKA3iLeupppbsfN4kuuX+5JGU5Nvt3vJv2wTbN8KrSOClVUi6cf5QYRl7vwKBgQDPpu/PT4Vx0/I9UAIhOqkWwUycjJVuD5qzCxBKpKBB/b45UCbzDZ6LDmiyrt5OBERGWb9I9WPQVH9i2OKHHc6PYv2vDb9U9Cr8RPW3H5+S3zcMYvJfpTKKQWzLa42dnU8ouuvRmi44LVDx9yNVHpP4+Vlq+5h7ecwZEFXKd51fBQKBgBVEGZJiVhvtfPA59qraz7JyQb8xVItjP+hLjLI2dX/NXz6FWabO9CJoNAVfpqPAhg7HkLBdi7vtgNywTjqJwHIzbOYyRoru+tbKorlmOKuCRFRvG4or1ISvC29zHG0bHZVGXXNM/Wvl74dV8Zrwr1Fth9qWadu/Ax39Jaft+bRVAoGAFwwmTdI7s3icyGVa9yk1n0rxH+cSptagiwLNWhuPlgN924qj6BI46KI+yKZUEkCy+0P20Tg7TeIzCVudOPX7+To5gfZ6qAk5xCo7Q4oFAh44U+2fjTIeu+2rD6DuZPIS2Sh2CBueyalt9I1DpKzyK44xeIhYUkwgdR+1BfXkx6kCgYAFJYNxqXS1qwCMesMmNVnQxAvD6H7LVKrYUu+wBck7xJIbHK3EB09a0DIm955ORe6JrlEn4PRYE5fhr9Wgm3fR78WsawER/nQc1OpkL8/NaEUOGbL0uW3RbZg1ZXFxldV39LSKoG9hgCNihRs4tznQaTbNQbzaC+IL+COomLlzGw=="))

  console.log "Loading Keys";
  Promise.all(
    for i in [0..6]
      if(i<2)
        window.crypto.subtle.importKey(
          "raw",
          Raw[i],
          {
            name:"AES-CBC"
          },
          true,
          ["encrypt","decrypt"]
        )
        .then((key)->
          Keys.push(key)
          )
        .then(null,(err)->
          console.error(err)
        )
      else if (i==2)

        window.crypto.subtle.importKey("pkcs8",
          Raw[i],
          {
            name:"RSA-OAEP",
            hash: {name: "SHA-1"},
          },
          true,
          ["decrypt","unwrapKey"]
        )

        .then((key)->
          Keys.push(key)
          )
        .then(null,(err)->
          console.error(err)
        )
      else if(i==3)
        window.crypto.subtle.importKey("spki",
          Raw[i],
          {
            name:"RSA-OAEP",
            hash: {name: "SHA-1"},
          },
          true,
          ["encrypt","wrapKey"]
        )
        .then((key)->
          Keys.push(key)
          )
        .then(null,(err)->
          console.error(err)
        )
      else if (i==4)
        window.crypto.subtle.importKey(
          "spki",
          Raw[i],
          {
            name: "RSASSA-PKCS1-v1_5",
            hash: {name: "SHA-1"},
          },
          true,
          ["verify"]
        )
        .then((key)->
          Keys.push(key)
          )
        .then(null,(err)->
          console.error(err)
        )
      else if(i==5)
        window.crypto.subtle.importKey("pkcs8",
          Raw[i],
          {
            name: "RSASSA-PKCS1-v1_5",
            hash: {name: "SHA-1"},
          },
          true,
          ["sign"]
        )
        .then((key)->
          Keys.push(key)
          )
        .then(null,(err)->
          console.error(err)
        )
      else if(i==6)
        window.crypto.subtle.importKey("raw",
          Raw[1],
          {
            name: "HMAC",
            hash: {name: "SHA-1"},
          },
          true,
          ["sign","verify"]
        )
        .then((key)->
          Keys.push(key)
          )
        .then(null,(err)->
          console.error(err)
        )
  )
  .then((test)->
    @AES128Key = Keys[0]
    @AES256Key = Keys[1]
    @RSAOAEP_Dec = Keys[2]
    @RSAOAEP_Enc = Keys[3]
    @RSASSA_Ver = Keys[4]
    @RSASSA_Sign = Keys[5]
    @HMAC = Keys[6]
  )


RunTest = () ->
  resetResults()
  ###
  if $("#CheckboxE1")[0].checked
    test_Encryption()
  ###

  if $("#CheckboxE2")[0].checked
    test_Encryption_Complete_Doc()

  if $("#CheckboxE3")[0].checked
    test_Encryption_OneElement_By_Id()

  if $("#CheckboxE4")[0].checked
    test_Encryption_TwoElements_By_Id()

  if $("#CheckboxE5")[0].checked
    test_Encryption_All_Book_Elements()

  if $("#CheckboxE6")[0].checked
    test_Encryption_OneChild()

  if $("#CheckboxE7")[0].checked
    test_Encryption_Content()

  if $("#CheckboxE8")[0].checked
    test_Encryption_Content_and_Element()

  if $("#CheckboxD1")[0].checked
    test_Decryption_Complete_Doc()

  if $("#CheckboxD2")[0].checked
    test_Decryption_OneElement()

  if $("#CheckboxD3")[0].checked
    test_Decryption_All_Book_Elements()

  if $("#CheckboxD4")[0].checked
    test_Decryption_OneChild()

  if $("#CheckboxD5")[0].checked
    test_Decryption_Content()

  if $("#CheckboxD6")[0].checked
    test_Decryption_Content_and_Element()

  if $("#CheckboxDI1")[0].checked
    test_Decryption_ISO_Complete_Doc()

  if $("#CheckboxDI2")[0].checked
    test_Decryption_ISO_OneElement()

  if $("#CheckboxDI3")[0].checked
    test_Decryption_ISO_All_Book_Elements()

  if $("#CheckboxDI4")[0].checked
    test_Decryption_ISO_OneChild()

  if $("#CheckboxDI5")[0].checked
    test_Decryption_ISO_Content()

  if $("#CheckboxDI6")[0].checked
    test_Decryption_ISO_Content_and_Element()

  if $("#CheckboxS1")[0].checked
    test_Sign_Complete_Document()

  if $("#CheckboxS2")[0].checked
    test_Sign_OneElementById()

  if $("#CheckboxS3")[0].checked
    test_Sign_TwoElementsById()

  if $("#CheckboxS4")[0].checked
    test_Sign_OneChildElement()

  if $("#CheckboxS5")[0].checked
    test_Sign_AllBookElements()

  if $("#CheckboxSM1")[0].checked
    test_MAC_Sign_Complete_Document()

  if $("#CheckboxV1")[0].checked
    test_Verify_Complete_Document()

  if $("#CheckboxV2")[0].checked
    test_Verify_OneElementById()

  if $("#CheckboxV3")[0].checked
    test_Verify_TwoElementsById()

  if $("#CheckboxV4")[0].checked
    test_Verify_OneChildElement()

  if $("#CheckboxV5")[0].checked
    test_Verify_AllBookElements()

  if $("#CheckboxVM1")[0].checked
    test_Verify_MAC_Complete_Document()

  if $("#CheckboxSD1")[0].checked
    test_SignDetached_Complete_Document()

  if $("#CheckboxSD2")[0].checked
    test_SignDetached_OneElementById()

  if $("#CheckboxSD3")[0].checked
    test_SignDetached_TwoElementsById()

  if $("#CheckboxSD4")[0].checked
    test_SignDetached_OneChildElement()

  if $("#CheckboxSD5")[0].checked
    test_SignDetached_AllBookElements()

  if $("#CheckboxVD1")[0].checked
    test_VerifyDetached_Complete_Document()

  if $("#CheckboxVD2")[0].checked
    test_VerifyDetached_OneElementById()

  if $("#CheckboxVD3")[0].checked
    test_VerifyDetached_TwoElementsById()

  if $("#CheckboxVD4")[0].checked
    test_VerifyDetached_OneChildElement()

  if $("#CheckboxVD5")[0].checked
    test_VerifyDetached_AllBookElements()

  if $("#CheckboxVN1")[0].checked
    test_Verify_NegativeDigest()

  if $("#CheckboxVN2")[0].checked
    test_Verify_NegativeSignatureValue()

  if $("#CheckboxVN3")[0].checked
    test_Verify_Negative_WrongKey()

  if $("#CheckboxED1")[0].checked
    test_KeyInfo_Roundtrip_oneElement()

  if $("#CheckboxED2")[0].checked
    test_KeyInfo_Roundtrip_TwoElements()

resetResults = () ->
  $(".Tests").css("background-color","gold")

test_KeyInfo_Roundtrip_oneElement = ()->
  $.get (documentRoot+"/Decryption/PKCS7_Padding/One_Element_with_KeyInfo.xml") ,( data ) ->
    chipher = data
    referenceXML = documentRoot+"/Original_XML/Minimal_3.xml"
    actualDiv = "#div_ED1"
    decrypt(chipher,window.RSAOAEP_Dec,referenceXML)
    .then((documents)->
      plainXML = documents[0]
      xpath = []
      xpath.push("//*[@id='bk101']")
      encrypt(plainXML,xpath,window.AES128Key,referenceXML,"rsaKey",window.RSAOAEP_Enc,true,false)
      .then((documents)->
        chipher = documents[0]
        decrypt(chipher,window.RSAOAEP_Dec,referenceXML)
        .then((documents)->
            compare(documents[0],documents[1],actualDiv)
          )
        )
      )

test_KeyInfo_Roundtrip_TwoElements = ()->
  $.get documentRoot+"/Decryption/PKCS7_Padding/Two_Elements_with_KeyInfo.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+"/Original_XML/Minimal_for_KeyInfo.xml"
    actualDiv = "#div_ED2"
    decrypt(chipher,window.RSAOAEP_Dec,referenceXML)
    .then((documents)->
      plainXML = documents[0]
      xpath = []
      xpath.push("//*[@id='bk101']")
      xpath.push("//*[@id='bk102']")
      encrypt(plainXML,xpath,window.AES256Key,referenceXML,"rsaKey",window.RSAOAEP_Enc,true,false)
      .then((documents)->
        chipher = documents[0]
        decrypt(chipher,window.RSAOAEP_Dec,referenceXML)
        .then((documents)->
            compare(documents[0],documents[1],actualDiv)
          )
        )
      )

test_Decryption_Complete_Doc = () ->
  $.get documentRoot+"/Decryption/PKCS7_Padding/Complete_Document.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument
    actualDiv = "#div_D1"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Decryption_OneElement = () ->
  $.get documentRoot+"/Decryption/PKCS7_Padding/One_Element.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument
    actualDiv = "#div_D2"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Decryption_All_Book_Elements = () ->
  $.get documentRoot+"/Decryption/PKCS7_Padding/All_Book_Elements.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument
    actualDiv = "#div_D3"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Decryption_OneChild = () ->
  $.get documentRoot+"/Decryption/PKCS7_Padding/One_Child_Element.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument
    actualDiv = "#div_D4"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Decryption_Content = () ->
  $.get documentRoot+"/Decryption/PKCS7_Padding/Content.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument
    actualDiv = "#div_D5"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Decryption_Content_and_Element = () ->
  $.get documentRoot+"/Decryption/PKCS7_Padding/Content_and_Element.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument
    actualDiv = "#div_D6"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Decryption_ISO_Complete_Doc = () ->
  $.get documentRoot+"/Decryption/ISOPadding/Complete_Document.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument2
    actualDiv = "#div_DI1"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Decryption_ISO_OneElement = () ->
  $.get documentRoot+"/Decryption/ISOPadding/One_Element.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument2
    actualDiv = "#div_DI2"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Decryption_ISO_All_Book_Elements = () ->
  $.get documentRoot+"/Decryption/ISOPadding/All_Book_Elements.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument2
    actualDiv = "#div_DI3"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Decryption_ISO_OneChild = () ->
  $.get documentRoot+"/Decryption/ISOPadding/One_Child_Element.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument2
    actualDiv = "#div_DI4"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Decryption_ISO_Content = () ->
  $.get documentRoot+"/Decryption/ISOPadding/Content.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument2
    actualDiv = "#div_DI5"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Decryption_ISO_Content_and_Element = () ->
  $.get documentRoot+"/Decryption/ISOPadding/Content_and_Element.xml" ,( data ) ->
    chipher = data
    referenceXML = documentRoot+refenceDocument
    actualDiv = "#div_DI6"
    decrypt(chipher,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )


test_Encryption_Complete_Doc = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Encryption/Complete_Document.xml"
    xpath.push("//*")
    actualDiv = "#div_E2"
    encrypt(plainXML,xpath,window.AES256Key,referenceXML)
    .then((documents)->
        compare(documents[0],documents[1],actualDiv)
      )

test_Encryption_OneElement_By_Id = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Encryption/One_Element_By_ID.xml"
    xpath.push("//*[@id='bk101']")
    actualDiv = "#div_E3"
    encrypt(plainXML,xpath,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Encryption_TwoElements_By_Id = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    xpath = []
    plainXML = data
    referenceXML = documentRoot+"/Encryption/Two_Elements_By_ID.xml"
    xpath.push("//*[@id='bk101']")
    xpath.push("//*[@id='bk102']")
    actualDiv = "#div_E4"
    encrypt(plainXML,xpath,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Encryption_All_Book_Elements = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Encryption/All_Book_Elements.xml"
    xpath.push("//*[local-name()='book']")
    actualDiv = "#div_E5"
    encrypt(plainXML,xpath,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Encryption_OneChild = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Encryption/One_Child_Element.xml"
    xpath.push("//*[@id='bk101']/author")
    actualDiv = "#div_E6"
    encrypt(plainXML,xpath,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Encryption_Content = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Encryption/Content.xml"
    xpath.push("/catalog/book[1]/author/text()")
    actualDiv = "#div_E7"
    encrypt(plainXML,xpath,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Encryption_Content_and_Element = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Encryption/Content_and_Element.xml"
    xpath.push("/catalog/book[1]/author/text()")
    xpath.push("//*[@id='bk102']")
    actualDiv = "#div_E8"
    encrypt(plainXML,xpath,window.AES256Key,referenceXML)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Sign_Complete_Document = () ->
  $.get documentRoot+refenceDocument3 ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Signature/Enveloped/Complete_Document.xml"
    xpath.push("/*")
    actualDiv = "#div_S1"
    sign(plainXML, xpath ,window.RSASSA_Ver,window.RSASSA_Sign,referenceXML,"env")
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )
test_MAC_Sign_Complete_Document = () ->
  $.get documentRoot+refenceDocument3 ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Signature/Enveloped/Complete_Document_MAC.xml"
    xpath.push("/*")
    actualDiv = "#div_SM1"
    sign(plainXML, xpath ,window.HMAC,window.HMAC,referenceXML,"env",true)
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Sign_OneElementById = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Signature/Enveloped/One_Element_By_ID.xml"
    xpath.push("//*[@id='bk101']")
    actualDiv = "#div_S2"
    sign(plainXML, xpath ,window.RSASSA_Ver,window.RSASSA_Sign,referenceXML,"env")
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Sign_TwoElementsById = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Signature/Enveloped/Two_Elements_By_ID.xml"
    xpath.push("//*[@id='bk101']")
    xpath.push("//*[@id='bk102']")
    actualDiv = "#div_S3"
    sign(plainXML, xpath ,window.RSASSA_Ver,window.RSASSA_Sign,referenceXML,"env")
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Sign_OneChildElement= () ->
  $.get documentRoot+refenceDocument3 ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Signature/Enveloped/One_Child_Element.xml"
    xpath.push("//*[@id='bk101']/author")
    actualDiv = "#div_S4"
    sign(plainXML, xpath ,window.RSASSA_Ver,window.RSASSA_Sign,referenceXML,"env")
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_Sign_AllBookElements = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Signature/Enveloped/All_Book_Elements.xml"
    xpath.push("//*[local-name()='book']")
    actualDiv = "#div_S5"
    sign(plainXML, xpath ,window.RSASSA_Ver,window.RSASSA_Sign,referenceXML,"env")
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_SignDetached_Complete_Document = () ->
  $.get documentRoot+refenceDocument3 ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Signature/Detached/Complete_Document.xml"
    xpath.push("/*")
    actualDiv = "#div_SD1"
    sign(plainXML, xpath ,window.RSASSA_Ver,window.RSASSA_Sign,referenceXML,"det")
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_SignDetached_OneElementById = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Signature/Detached/One_Element_By_ID.xml"
    xpath.push("//*[@id='bk101']")
    actualDiv = "#div_SD2"
    sign(plainXML, xpath ,window.RSASSA_Ver,window.RSASSA_Sign,referenceXML,"det")
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_SignDetached_TwoElementsById = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Signature/Detached/Two_Elements_By_ID.xml"
    xpath.push("//*[@id='bk101']")
    xpath.push("//*[@id='bk102']")
    actualDiv = "#div_SD3"
    sign(plainXML, xpath ,window.RSASSA_Ver,window.RSASSA_Sign,referenceXML,"det")
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_SignDetached_OneChildElement= () ->
  $.get documentRoot+refenceDocument3 ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Signature/Detached/One_Child_Element.xml"
    xpath.push("//*[@id='bk101']/author")
    actualDiv = "#div_SD4"
    sign(plainXML, xpath ,window.RSASSA_Ver,window.RSASSA_Sign,referenceXML,"det")
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )

test_SignDetached_AllBookElements = () ->
  $.get documentRoot+refenceDocument ,( data ) ->
    plainXML = data
    xpath = []
    referenceXML = documentRoot+"/Signature/Detached/All_Book_Elements.xml"
    xpath.push("//*[local-name()='book']")
    #xpath.push("book")
    actualDiv = "#div_SD5"
    sign(plainXML, xpath ,window.RSASSA_Ver,window.RSASSA_Sign,referenceXML,"det")
    .then((documents)->
      compare(documents[0],documents[1],actualDiv)
      )


test_Verify_Complete_Document = () ->
  $.get documentRoot+"/Verification/Enveloped/Complete_Document.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_V1"
    verify(signedXML,actualDiv)

test_Verify_MAC_Complete_Document = () ->
  $.get documentRoot+"/Verification/Enveloped/Complete_Document_MAC.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_VM1"
    verify(signedXML,actualDiv,false,true)

test_Verify_OneElementById = () ->
  $.get documentRoot+"/Verification/Enveloped/One_Element_By_ID.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_V2"
    verify(signedXML,actualDiv)

test_Verify_TwoElementsById = () ->
  $.get documentRoot+"/Verification/Enveloped/Two_Elements_By_ID.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_V3"
    verify(signedXML,actualDiv)

test_Verify_OneChildElement = () ->
  $.get documentRoot+"/Verification/Enveloped/One_Child_Element.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_V4"
    verify(signedXML,actualDiv)

test_Verify_AllBookElements = () ->
  $.get documentRoot+"/Verification/Enveloped/All_Book_Elements.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_V5"
    verify(signedXML,actualDiv)

test_VerifyDetached_Complete_Document = () ->
  $.get documentRoot+"/Verification/Detached/Complete_Document.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_VD1"
    verify(signedXML,actualDiv)

test_VerifyDetached_OneElementById = () ->
  $.get documentRoot+"/Verification/Detached/One_Element_By_ID.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_VD2"
    verify(signedXML,actualDiv)

test_VerifyDetached_TwoElementsById = () ->
  $.get documentRoot+"/Verification/Detached/Two_Elements_By_ID.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_VD3"
    verify(signedXML,actualDiv)

test_VerifyDetached_OneChildElement = () ->
  $.get documentRoot+"/Verification/Detached/One_Child_Element.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_VD4"
    verify(signedXML,actualDiv)

test_VerifyDetached_AllBookElements = () ->
  $.get documentRoot+"/Verification/Detached/All_Book_Elements.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_VD5"
    verify(signedXML,actualDiv)

test_Verify_NegativeDigest = () ->
  $.get documentRoot+"/Verification/Enveloped/NegativeDigest.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_VN1"
    verify(signedXML,actualDiv,true)

test_Verify_NegativeSignatureValue = () ->
  $.get documentRoot+"/Verification/Enveloped/NegativeSignatureValue.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_VN2"
    verify(signedXML,actualDiv,true)

test_Verify_Negative_WrongKey = () ->
  $.get documentRoot+"/Verification/Enveloped/NegativeSignatureValue.xml" ,( data ) ->
    signedXML = data
    actualDiv ="#div_VN3"
    verify(signedXML,actualDiv,true)

visualisation = (actualDiv,result) ->
  if(result)
    $(actualDiv).css("background-color","lime")
    #console.log "Test" + $(actualDiv)[0].innerText+" erfolgreich"
  else
    $(actualDiv).css("background-color","red")
    console.log "Test " + $(actualDiv)[0].innerText+" NICHT erfolgreich"

compare = (createdDoc,referenceXML,actualDiv) ->
  $.get referenceXML ,( compare ) ->

    if createdDoc.firstChild.nodeType == 10
      createdDoc.firstChild.remove()
    if compare.firstChild.nodeType == 10
      compare.firstChild.remove()

    serializer = new XMLSerializer
    createdDoc = serializer.serializeToString(createdDoc)
    createdDoc = createdDoc.replace(/\r?\n|\r/g,'')
    createdDoc = createdDoc.replace(/\>\s+\</g,'><')
    compare = serializer.serializeToString(compare)
    compare = compare.replace(/\r?\n|\r/g,'')
    compare = compare.replace(/\>\s+\</g,'><')
    result = false
    if(createdDoc==compare)
      result = true
    visualisation(actualDiv,result)

encrypt = (plainXML,xPath,key,referenceXML,KeyName,asymKey,withKeyInfo,staticIV) ->
  references = []
  encryptedXML = new EncryptedXML()
  for i in [0..xPath.length-1]
    reference = new Reference(xPath[i])
    references.push(reference)
  that = @
  encParams = new EncryptionParams
  encParams.setPublicKey(asymKey,KeyName)
  encParams.setSymmetricKey(key)
  encParams.setReferences(references)
  encParams.setStaticIV(true)
  encryptedXML.encrypt(plainXML,encParams.getEncryptionInfo())
  .then((encrypted)->
      return [encrypted,referenceXML]
    )

sign = (plainXML,xPath,publicKey, privateKey,referenceXML,sigType,MAC) ->
  references = []
  #transforms = ["envSig","c14n"]
  #transforms = ["c14n","envSig"]
  transforms = [Algorithms.TransformAlgorithms.C14N]
  digestAlg = Algorithms.DigestAlgorithms.SHA1
  for i in [0..xPath.length-1]
    reference = new Reference(xPath[i],transforms,digestAlg)
    references.push(reference)
  that = @
  signatureParams = new SignatureParams
  if !MAC
    signatureParams.setSigAlg(Algorithms.SigningAlgorithms.RSA.SHA1)
  else
    signatureParams.setSigAlg(Algorithms.SigningAlgorithms.HMAC.SHA1)
  signatureParams.setReferences(references)
  signatureParams.setKeyPair(publicKey,privateKey)
  signatureParams.setPrefix("ds")
  signatureParams.setCanonicalisationAlg(Algorithms.TransformAlgorithms.C14N)
  if sigType == "env"
    signatureParams.setSignatureType(XMLSecEnum.signatureTypesEnum.Enveloped)
  if sigType == "det"
    signatureParams.setSignatureType(XMLSecEnum.signatureTypesEnum.Detached)
  signedXML = new SignedXML()
  signedXML.sign(plainXML,signatureParams.getSignatureParams())
  .then((signed)->
    return [signed,referenceXML]
    )

verify=(signedXML,actualDiv,negative,MAC) ->
  sigVerifier = new SignedXML()
  if !MAC
    sigVerifier.loadKey(signedXML)
    .then((key)->
      sigVerifier.verify(signedXML,key)
      .then((verification)->
        if(!negative)
          visualisation(actualDiv,verification.result)
        else if(negative)
          visualisation(actualDiv,!verification.result)
        )
      )
  else
    key = window.HMAC
    sigVerifier.verify(signedXML,key)
    .then((verification)->
      if(!negative)
        visualisation(actualDiv,verification.result)
      else if(negative)
        visualisation(actualDiv,!verification.result)
      )


decrypt = (chipherXML,key,referenceXML) ->
  references = []
  encryptedXML = new EncryptedXML()
  encryptedXML.decrypt(chipherXML,key)
  .then((decrypted)->
      return [decrypted,referenceXML]
    )

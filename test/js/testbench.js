(function() {
  var DigestAlgIdentifiers, PlainDocument, RunTest, SignaturAlgorithemIdenifiers, TransformIdentifiers, compare, decrypt, deselectAll, documentRoot, encrypt, exportKey, loadKeys, refenceDocument, refenceDocument2, refenceDocument3, resetResults, selectAll, sign, test_Decryption_All_Book_Elements, test_Decryption_Complete_Doc, test_Decryption_Content, test_Decryption_Content_and_Element, test_Decryption_ISO_All_Book_Elements, test_Decryption_ISO_Complete_Doc, test_Decryption_ISO_Content, test_Decryption_ISO_Content_and_Element, test_Decryption_ISO_OneChild, test_Decryption_ISO_OneElement, test_Decryption_OneChild, test_Decryption_OneElement, test_Encryption_All_Book_Elements, test_Encryption_Complete_Doc, test_Encryption_Content, test_Encryption_Content_and_Element, test_Encryption_OneChild, test_Encryption_OneElement_By_Id, test_Encryption_TwoElements_By_Id, test_KeyInfo_Roundtrip_TwoElements, test_KeyInfo_Roundtrip_oneElement, test_MAC_Sign_Complete_Document, test_SignDetached_AllBookElements, test_SignDetached_Complete_Document, test_SignDetached_OneChildElement, test_SignDetached_OneElementById, test_SignDetached_TwoElementsById, test_Sign_AllBookElements, test_Sign_Complete_Document, test_Sign_OneChildElement, test_Sign_OneElementById, test_Sign_TwoElementsById, test_VerifyDetached_AllBookElements, test_VerifyDetached_Complete_Document, test_VerifyDetached_OneChildElement, test_VerifyDetached_OneElementById, test_VerifyDetached_TwoElementsById, test_Verify_AllBookElements, test_Verify_Complete_Document, test_Verify_MAC_Complete_Document, test_Verify_NegativeDigest, test_Verify_NegativeSignatureValue, test_Verify_Negative_WrongKey, test_Verify_OneChildElement, test_Verify_OneElementById, test_Verify_TwoElementsById, verify, visualisation;

  PlainDocument = "";

  documentRoot = "./test/Documents";

  refenceDocument = "/Original_XML/Minimal.xml";

  refenceDocument2 = "/Original_XML/Minimal_2.xml";

  refenceDocument3 = "/Original_XML/Minimal_Full_ID.xml";

  TransformIdentifiers = {
    envSig: "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
    c14n: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
  };

  DigestAlgIdentifiers = {
    SHA1: "http://www.w3.org/2000/09/xmldsig#sha1"
  };

  SignaturAlgorithemIdenifiers = {
    RSASHA1: "http://www.w3.org/2000/09/xmldsig#rsa-sha1"
  };

  $(document).ready(function() {
    $("#RunTest").click(RunTest);
    $("#selectAll").click(selectAll);
    $("#deselectAll").click(deselectAll);
    $("#exportKey").click(exportKey);
    console.log("DOM is ready");
    resetResults();
    return loadKeys().then(function() {});
  });

  exportKey = function() {
    var key;
    key = window.RSAOAEP_Dec;
    return window.crypto.subtle.exportKey("jwk", key).then(function(exportedKey) {
      return console.log(exportedKey);
    });
  };

  selectAll = function() {
    $(".CBTestsE").prop("checked", true);
    $(".CBTestsD").prop("checked", true);
    $(".CBTestsDI").prop("checked", true);
    $(".CBTestsS").prop("checked", true);
    $(".CBTestsV").prop("checked", true);
    $(".CBTestsVN").prop("checked", true);
    $(".CBTestsVD").prop("checked", true);
    return $(".CBTestsSD").prop("checked", true);
  };

  deselectAll = function() {
    $(".CBTestsE").prop("checked", false);
    $(".CBTestsD").prop("checked", false);
    $(".CBTestsDI").prop("checked", false);
    $(".CBTestsS").prop("checked", false);
    $(".CBTestsV").prop("checked", false);
    $(".CBTestsVN").prop("checked", false);
    $(".CBTestsVD").prop("checked", false);
    return $(".CBTestsSD").prop("checked", false);
  };

  loadKeys = function() {
    var Raw, i;
    Raw = [];
    Raw.push(Helper.base64ToArrayBuffer("1SGU0rzAg2MOXTwOskSpyg=="));
    Raw.push(Helper.base64ToArrayBuffer("BQVdjWk1XFdbRCET3VU5BZqCIQqNIazsuCn/W/xACdM="));
    Raw.push(Helper.base64ToArrayBuffer("MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCbm2m+gBVV0U5QziTphNkIDhjawzMMg483AsFWDq0v7EhmPddgP+5gHx5nC6hHz/ckOHeDR06Ck+PvHESGuP6iZKZtzDSq4xnkfrW6/cUvSIpWIH+b0Am2VsEG5d2AyYVyxNPaoc26It80ugpkVPICvnwFAawhHcHha8j3EWUiJ005UkoA8XmX5336ZqRV/X6AFlyuJ1YwKGQmxDKYMMCoSbJYlK91x04dhW0BQEzlujobWdlDAq4kCiOFUhgQz9Ft/fvkNTkpYcxM0lTHjJFortp4VzWe92NGFsIubX1KKgoyiXwoPR2rIoA60VMwUoKNf6YlSC1ozKOyHX0SCDADAgMBAAECggEAQECDAGM47A+aC+mi+j2dtCLGBoa1bIRiPW/IzzUONAyXtIfyh86+KjiPQDNjEAwCW5VpW+60r1xLsO72KL74faubwRih4rIVffEILyccJbMJVBjlODxF1mGqIKQHu2b60HIPnGZVYXeGvOnY4qbkq1dmNFcFcUMtTFxKRiKLpPb6c3D3OU3KyrPGjeLlkCPmyLDXR0ZSEnmVJlpiY4OGDcbgc+Bp7uQs6pzcz+vserzmVqCo8jpfIefj/rikVeo2GNIGaSOFnHjrWuu9qXpjE+TTpMwg3bTBmBDyCPqYWqo1Fwzq9cv1J/HerAW6e9tkmIdeZ420u6D407IyQ1QZwQKBgQDSIpXROw3W3pkDzpH79646Lwg5HLTqAU219UvUfK0YrTcoZ1WKmvA0I3QlexjVN6e8EonyFvCjkOczgpXvf9W6HRXQ/YOd6eGAo2O9ftU7wDwqk0FKRd52tdPXZqS8TNAR9/XmvWEp6v8Nuc7Cyq4cqjhibUvW76mxKWZnAVSp4wKBgQC9kgt3gyN2S2TFtDQPAp4soeLNbsn2kUL0DBtvFt7FRDMgchDzucHYr2aktUl0MUCBbPTz7Olqi4B/u3m1yn+ogm3ua86+9cOYrZfx7cG521gjDmtDHGx96QoW2xOsvhiJUOln2cx0+f8J+IQKLlIU0L8RZq85yXcP97Nxxqm7YQKBgQCikMkQpjwNqAX+sPe1U6cBMlONQ40en8WL6GoyyAVt2suaQV8nLLh5zZfUS0gp47WrRThdBqxCDh8fdX4jW+Vv54JyPT5uk3q2dzD5b77tS8oAMg3HtQfnFMH/mVQGrPInhIpDaO1bbYbGCqJPhlduq62VT/LlJGJGQb4MIDZsewKBgDwZVetQtuhk5JDNHYf4s37A3+9zBTJXQRuvzu68GGn/whmyL++k33C7wtXK53uftaySh2HhpOpzSYy1OdPJXAlnOETTBtuBfL4lors/PiCXCm0qwBSpqTeNrvYqBCXKqmq2LRkQcoJPU2yszeeQYdNZjomMvVabqVR1mf0jF2JhAoGANbJIGcWnmzEJaOathYGGsWJdGgQBChOy6k2XyLvEVtEKfVmlX2asaflC9ick5XSFvcpuiK1XWpo8Pw4QD3f4nABE0Ll7LeEoAnbkPrYhduWvpLmSa9+0UIJ19vLcfuDUZ+cS0gT+8fxOfv1yqZMn5szyLs3tDFoxzh3tpqNzcKI="));
    Raw.push(Helper.base64ToArrayBuffer("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm5tpvoAVVdFOUM4k6YTZCA4Y2sMzDIOPNwLBVg6tL+xIZj3XYD/uYB8eZwuoR8/3JDh3g0dOgpPj7xxEhrj+omSmbcw0quMZ5H61uv3FL0iKViB/m9AJtlbBBuXdgMmFcsTT2qHNuiLfNLoKZFTyAr58BQGsIR3B4WvI9xFlIidNOVJKAPF5l+d9+makVf1+gBZcridWMChkJsQymDDAqEmyWJSvdcdOHYVtAUBM5bo6G1nZQwKuJAojhVIYEM/Rbf375DU5KWHMTNJUx4yRaK7aeFc1nvdjRhbCLm19SioKMol8KD0dqyKAOtFTMFKCjX+mJUgtaMyjsh19EggwAwIDAQAB"));
    Raw.push(Helper.base64ToArrayBuffer("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv0kIIStBP1QppqgtHj+fENpEx6ktFa8750n3oMpN1aA+3fRA5cnokWCBaxHCR8cZN6dF5gYd4b9MrY5pckdPwPMNelIbDnzVlmZ9e40xSY+eYkoUdSzc3O6Z0QOyJ6brTyFdPi1B15SOTflxntD14Yh7JcH4rS1UEEVwBKz/j8JzeJbno2V3xX+iI0he8Y/0tF5FcmzzpCAskDVsSL/o/OLBDcOrTc8RSxo/EAhPMc9fBqgNm2yNvB57BjP7NkphpVrPO4RXyQtv13YMBzfNqt4q2DQEQKYwyPulazqwZLJ7FBRAqcdHm2r64NhVs//awvQXA9ibyke9KkB3B45LuwIDAQAB"));
    Raw.push(Helper.base64ToArrayBuffer("MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC/SQghK0E/VCmmqC0eP58Q2kTHqS0VrzvnSfegyk3VoD7d9EDlyeiRYIFrEcJHxxk3p0XmBh3hv0ytjmlyR0/A8w16UhsOfNWWZn17jTFJj55iShR1LNzc7pnRA7InputPIV0+LUHXlI5N+XGe0PXhiHslwfitLVQQRXAErP+PwnN4luejZXfFf6IjSF7xj/S0XkVybPOkICyQNWxIv+j84sENw6tNzxFLGj8QCE8xz18GqA2bbI28HnsGM/s2SmGlWs87hFfJC2/XdgwHN82q3irYNARApjDI+6VrOrBksnsUFECpx0ebavrg2FWz/9rC9BcD2JvKR70qQHcHjku7AgMBAAECggEACI7H4lQBE0g8pMwZWKUYBLT/Jr+W2MWCNJLGlVb3rHsC1QM8dAtYcEiVAalFu9hYdHjzU5sqcxMP5yPb69Ts6ID3NWW++CL1m0jyjDiA3/2g5FzUFXnwV6IFF6jGq6d4F44ykbmMnIx04WAriSNoHLLyb3oCGh1RCXlRzaO/uzqwAKWsnUs5I8RjwA4zVbNRos3z0vjep/5R7aMC/xr0RG6llzgVWnXE+q6pfKuvyJmj4B7sQx2G6NcAOm6qst6XO5x0JRj+yiKjveIKn9u7HRWZcs1LhNIkuq3mV9X52JOkutPWGNa40LMKmqyhtPUvAg9b2TP4WIyqj2yvoxjYYQKBgQDr0o3WwkCNimPgElF4ZaTqr7MiAbilSVjzwuFSWemSyzMFqClq2DCSxUgPaAvt8bKFI2joyuX8wvVEDq5BUf9ODPS4qlomh+rD2qPpK34gLm2e8mXDKA3iLeupppbsfN4kuuX+5JGU5Nvt3vJv2wTbN8KrSOClVUi6cf5QYRl7vwKBgQDPpu/PT4Vx0/I9UAIhOqkWwUycjJVuD5qzCxBKpKBB/b45UCbzDZ6LDmiyrt5OBERGWb9I9WPQVH9i2OKHHc6PYv2vDb9U9Cr8RPW3H5+S3zcMYvJfpTKKQWzLa42dnU8ouuvRmi44LVDx9yNVHpP4+Vlq+5h7ecwZEFXKd51fBQKBgBVEGZJiVhvtfPA59qraz7JyQb8xVItjP+hLjLI2dX/NXz6FWabO9CJoNAVfpqPAhg7HkLBdi7vtgNywTjqJwHIzbOYyRoru+tbKorlmOKuCRFRvG4or1ISvC29zHG0bHZVGXXNM/Wvl74dV8Zrwr1Fth9qWadu/Ax39Jaft+bRVAoGAFwwmTdI7s3icyGVa9yk1n0rxH+cSptagiwLNWhuPlgN924qj6BI46KI+yKZUEkCy+0P20Tg7TeIzCVudOPX7+To5gfZ6qAk5xCo7Q4oFAh44U+2fjTIeu+2rD6DuZPIS2Sh2CBueyalt9I1DpKzyK44xeIhYUkwgdR+1BfXkx6kCgYAFJYNxqXS1qwCMesMmNVnQxAvD6H7LVKrYUu+wBck7xJIbHK3EB09a0DIm955ORe6JrlEn4PRYE5fhr9Wgm3fR78WsawER/nQc1OpkL8/NaEUOGbL0uW3RbZg1ZXFxldV39LSKoG9hgCNihRs4tznQaTbNQbzaC+IL+COomLlzGw=="));
    console.log("Loading Keys");
    return Promise.all((function() {
      var j, results;
      results = [];
      for (i = j = 0; j <= 6; i = ++j) {
        if (i === 0) {
          results.push(window.crypto.subtle.importKey("raw", Raw[i], {
            name: "AES-CBC"
          }, true, ["encrypt", "decrypt"]).then(function(key) {
            return this.AES128Key = key;
          }).then(null, function(err) {
            return console.error(err);
          }));
        } else if (i === 1) {
          results.push(window.crypto.subtle.importKey("raw", Raw[i], {
            name: "AES-CBC"
          }, true, ["encrypt", "decrypt"]).then(function(key) {
            return this.AES256Key = key;
          }).then(null, function(err) {
            return console.error(err);
          }));
        } else if (i === 2) {
          results.push(window.crypto.subtle.importKey("pkcs8", Raw[i], {
            name: "RSA-OAEP",
            hash: {
              name: "SHA-1"
            }
          }, true, ["decrypt", "unwrapKey"]).then(function(key) {
            return this.RSAOAEP_Dec = key;
          }).then(null, function(err) {
            return console.error(err);
          }));
        } else if (i === 3) {
          results.push(window.crypto.subtle.importKey("spki", Raw[i], {
            name: "RSA-OAEP",
            hash: {
              name: "SHA-1"
            }
          }, true, ["encrypt", "wrapKey"]).then(function(key) {
            return this.RSAOAEP_Enc = key;
          }).then(null, function(err) {
            return console.error(err);
          }));
        } else if (i === 4) {
          results.push(window.crypto.subtle.importKey("spki", Raw[i], {
            name: "RSASSA-PKCS1-v1_5",
            hash: {
              name: "SHA-1"
            }
          }, true, ["verify"]).then(function(key) {
            return this.RSASSA_Ver = key;
          }).then(null, function(err) {
            return console.error(err);
          }));
        } else if (i === 5) {
          results.push(window.crypto.subtle.importKey("pkcs8", Raw[i], {
            name: "RSASSA-PKCS1-v1_5",
            hash: {
              name: "SHA-1"
            }
          }, true, ["sign"]).then(function(key) {
            return this.RSASSA_Sign = key;
          }).then(null, function(err) {
            return console.error(err);
          }));
        } else if (i === 6) {
          results.push(window.crypto.subtle.importKey("raw", Raw[1], {
            name: "HMAC",
            hash: {
              name: "SHA-1"
            }
          }, true, ["sign", "verify"]).then(function(key) {
            return this.HMAC = key;
          }).then(null, function(err) {
            return console.error(err);
          }));
        } else {
          results.push(void 0);
        }
      }
      return results;
    })());
  };

  RunTest = function() {
    resetResults();

    /*
    if $("#CheckboxE1")[0].checked
      test_Encryption()
     */
    if ($("#CheckboxE2")[0].checked) {
      test_Encryption_Complete_Doc();
    }
    if ($("#CheckboxE3")[0].checked) {
      test_Encryption_OneElement_By_Id();
    }
    if ($("#CheckboxE4")[0].checked) {
      test_Encryption_TwoElements_By_Id();
    }
    if ($("#CheckboxE5")[0].checked) {
      test_Encryption_All_Book_Elements();
    }
    if ($("#CheckboxE6")[0].checked) {
      test_Encryption_OneChild();
    }
    if ($("#CheckboxE7")[0].checked) {
      test_Encryption_Content();
    }
    if ($("#CheckboxE8")[0].checked) {
      test_Encryption_Content_and_Element();
    }
    if ($("#CheckboxD1")[0].checked) {
      test_Decryption_Complete_Doc();
    }
    if ($("#CheckboxD2")[0].checked) {
      test_Decryption_OneElement();
    }
    if ($("#CheckboxD3")[0].checked) {
      test_Decryption_All_Book_Elements();
    }
    if ($("#CheckboxD4")[0].checked) {
      test_Decryption_OneChild();
    }
    if ($("#CheckboxD5")[0].checked) {
      test_Decryption_Content();
    }
    if ($("#CheckboxD6")[0].checked) {
      test_Decryption_Content_and_Element();
    }
    if ($("#CheckboxDI1")[0].checked) {
      test_Decryption_ISO_Complete_Doc();
    }
    if ($("#CheckboxDI2")[0].checked) {
      test_Decryption_ISO_OneElement();
    }
    if ($("#CheckboxDI3")[0].checked) {
      test_Decryption_ISO_All_Book_Elements();
    }
    if ($("#CheckboxDI4")[0].checked) {
      test_Decryption_ISO_OneChild();
    }
    if ($("#CheckboxDI5")[0].checked) {
      test_Decryption_ISO_Content();
    }
    if ($("#CheckboxDI6")[0].checked) {
      test_Decryption_ISO_Content_and_Element();
    }
    if ($("#CheckboxS1")[0].checked) {
      test_Sign_Complete_Document();
    }
    if ($("#CheckboxS2")[0].checked) {
      test_Sign_OneElementById();
    }
    if ($("#CheckboxS3")[0].checked) {
      test_Sign_TwoElementsById();
    }
    if ($("#CheckboxS4")[0].checked) {
      test_Sign_OneChildElement();
    }
    if ($("#CheckboxS5")[0].checked) {
      test_Sign_AllBookElements();
    }
    if ($("#CheckboxSM1")[0].checked) {
      test_MAC_Sign_Complete_Document();
    }
    if ($("#CheckboxV1")[0].checked) {
      test_Verify_Complete_Document();
    }
    if ($("#CheckboxV2")[0].checked) {
      test_Verify_OneElementById();
    }
    if ($("#CheckboxV3")[0].checked) {
      test_Verify_TwoElementsById();
    }
    if ($("#CheckboxV4")[0].checked) {
      test_Verify_OneChildElement();
    }
    if ($("#CheckboxV5")[0].checked) {
      test_Verify_AllBookElements();
    }
    if ($("#CheckboxVM1")[0].checked) {
      test_Verify_MAC_Complete_Document();
    }
    if ($("#CheckboxSD1")[0].checked) {
      test_SignDetached_Complete_Document();
    }
    if ($("#CheckboxSD2")[0].checked) {
      test_SignDetached_OneElementById();
    }
    if ($("#CheckboxSD3")[0].checked) {
      test_SignDetached_TwoElementsById();
    }
    if ($("#CheckboxSD4")[0].checked) {
      test_SignDetached_OneChildElement();
    }
    if ($("#CheckboxSD5")[0].checked) {
      test_SignDetached_AllBookElements();
    }
    if ($("#CheckboxVD1")[0].checked) {
      test_VerifyDetached_Complete_Document();
    }
    if ($("#CheckboxVD2")[0].checked) {
      test_VerifyDetached_OneElementById();
    }
    if ($("#CheckboxVD3")[0].checked) {
      test_VerifyDetached_TwoElementsById();
    }
    if ($("#CheckboxVD4")[0].checked) {
      test_VerifyDetached_OneChildElement();
    }
    if ($("#CheckboxVD5")[0].checked) {
      test_VerifyDetached_AllBookElements();
    }
    if ($("#CheckboxVN1")[0].checked) {
      test_Verify_NegativeDigest();
    }
    if ($("#CheckboxVN2")[0].checked) {
      test_Verify_NegativeSignatureValue();
    }
    if ($("#CheckboxVN3")[0].checked) {
      test_Verify_Negative_WrongKey();
    }
    if ($("#CheckboxED1")[0].checked) {
      test_KeyInfo_Roundtrip_oneElement();
    }
    if ($("#CheckboxED2")[0].checked) {
      return test_KeyInfo_Roundtrip_TwoElements();
    }
  };

  resetResults = function() {
    return $(".Tests").css("background-color", "gold");
  };

  test_KeyInfo_Roundtrip_oneElement = function() {
    return $.get(documentRoot + "/Decryption/PKCS7_Padding/One_Element_with_KeyInfo.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + "/Original_XML/Minimal_3.xml";
      actualDiv = "#div_ED1";
      return decrypt(cipher, window.RSAOAEP_Dec, referenceXML).then(function(documents) {
        var plainXML, xpath;
        plainXML = documents[0];
        xpath = [];
        xpath.push("//*[@id='bk101']");
        return encrypt(plainXML, xpath, window.AES128Key, referenceXML, "rsaKey", window.RSAOAEP_Enc, true, false).then(function(documents) {
          cipher = documents[0];
          return decrypt(cipher, window.RSAOAEP_Dec, referenceXML).then(function(documents) {
            return compare(documents[0], documents[1], actualDiv);
          });
        });
      });
    });
  };

  test_KeyInfo_Roundtrip_TwoElements = function() {
    return $.get(documentRoot + "/Decryption/PKCS7_Padding/Two_Elements_with_KeyInfo.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + "/Original_XML/Minimal_for_KeyInfo.xml";
      actualDiv = "#div_ED2";
      return decrypt(cipher, window.RSAOAEP_Dec, referenceXML).then(function(documents) {
        var plainXML, xpath;
        plainXML = documents[0];
        xpath = [];
        xpath.push("//*[@id='bk101']");
        xpath.push("//*[@id='bk102']");
        return encrypt(plainXML, xpath, window.AES256Key, referenceXML, "rsaKey", window.RSAOAEP_Enc, true, false).then(function(documents) {
          cipher = documents[0];
          return decrypt(cipher, window.RSAOAEP_Dec, referenceXML).then(function(documents) {
            return compare(documents[0], documents[1], actualDiv);
          });
        });
      });
    });
  };

  test_Decryption_Complete_Doc = function() {
    return $.get(documentRoot + "/Decryption/PKCS7_Padding/Complete_Document.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument;
      actualDiv = "#div_D1";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Decryption_OneElement = function() {
    return $.get(documentRoot + "/Decryption/PKCS7_Padding/One_Element.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument;
      actualDiv = "#div_D2";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Decryption_All_Book_Elements = function() {
    return $.get(documentRoot + "/Decryption/PKCS7_Padding/All_Book_Elements.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument;
      actualDiv = "#div_D3";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Decryption_OneChild = function() {
    return $.get(documentRoot + "/Decryption/PKCS7_Padding/One_Child_Element.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument;
      actualDiv = "#div_D4";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Decryption_Content = function() {
    return $.get(documentRoot + "/Decryption/PKCS7_Padding/Content.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument;
      actualDiv = "#div_D5";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Decryption_Content_and_Element = function() {
    return $.get(documentRoot + "/Decryption/PKCS7_Padding/Content_and_Element.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument;
      actualDiv = "#div_D6";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Decryption_ISO_Complete_Doc = function() {
    return $.get(documentRoot + "/Decryption/ISOPadding/Complete_Document.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument2;
      actualDiv = "#div_DI1";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Decryption_ISO_OneElement = function() {
    return $.get(documentRoot + "/Decryption/ISOPadding/One_Element.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument2;
      actualDiv = "#div_DI2";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Decryption_ISO_All_Book_Elements = function() {
    return $.get(documentRoot + "/Decryption/ISOPadding/All_Book_Elements.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument2;
      actualDiv = "#div_DI3";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Decryption_ISO_OneChild = function() {
    return $.get(documentRoot + "/Decryption/ISOPadding/One_Child_Element.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument2;
      actualDiv = "#div_DI4";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Decryption_ISO_Content = function() {
    return $.get(documentRoot + "/Decryption/ISOPadding/Content.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument2;
      actualDiv = "#div_DI5";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Decryption_ISO_Content_and_Element = function() {
    return $.get(documentRoot + "/Decryption/ISOPadding/Content_and_Element.xml", function(data) {
      var actualDiv, cipher, referenceXML;
      cipher = data;
      referenceXML = documentRoot + refenceDocument;
      actualDiv = "#div_DI6";
      return decrypt(cipher, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Encryption_Complete_Doc = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Encryption/Complete_Document.xml";
      xpath.push("//*");
      actualDiv = "#div_E2";
      return encrypt(plainXML, xpath, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Encryption_OneElement_By_Id = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Encryption/One_Element_By_ID.xml";
      xpath.push("//*[@id='bk101']");
      actualDiv = "#div_E3";
      return encrypt(plainXML, xpath, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Encryption_TwoElements_By_Id = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      xpath = [];
      plainXML = data;
      referenceXML = documentRoot + "/Encryption/Two_Elements_By_ID.xml";
      xpath.push("//*[@id='bk101']");
      xpath.push("//*[@id='bk102']");
      actualDiv = "#div_E4";
      return encrypt(plainXML, xpath, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Encryption_All_Book_Elements = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Encryption/All_Book_Elements.xml";
      xpath.push("//*[local-name()='book']");
      actualDiv = "#div_E5";
      return encrypt(plainXML, xpath, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Encryption_OneChild = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Encryption/One_Child_Element.xml";
      xpath.push("//*[@id='bk101']/author");
      actualDiv = "#div_E6";
      return encrypt(plainXML, xpath, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Encryption_Content = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Encryption/Content.xml";
      xpath.push("/catalog/book[1]/author/text()");
      actualDiv = "#div_E7";
      return encrypt(plainXML, xpath, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Encryption_Content_and_Element = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Encryption/Content_and_Element.xml";
      xpath.push("/catalog/book[1]/author/text()");
      xpath.push("//*[@id='bk102']");
      actualDiv = "#div_E8";
      return encrypt(plainXML, xpath, window.AES256Key, referenceXML).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Sign_Complete_Document = function() {
    return $.get(documentRoot + refenceDocument3, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Signature/Enveloped/Complete_Document.xml";
      xpath.push("/*");
      actualDiv = "#div_S1";
      return sign(plainXML, xpath, window.RSASSA_Ver, window.RSASSA_Sign, referenceXML, "env").then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_MAC_Sign_Complete_Document = function() {
    return $.get(documentRoot + refenceDocument3, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Signature/Enveloped/Complete_Document_MAC.xml";
      xpath.push("/*");
      actualDiv = "#div_SM1";
      return sign(plainXML, xpath, window.HMAC, window.HMAC, referenceXML, "env", true).then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Sign_OneElementById = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Signature/Enveloped/One_Element_By_ID.xml";
      xpath.push("//*[@id='bk101']");
      actualDiv = "#div_S2";
      return sign(plainXML, xpath, window.RSASSA_Ver, window.RSASSA_Sign, referenceXML, "env").then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Sign_TwoElementsById = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Signature/Enveloped/Two_Elements_By_ID.xml";
      xpath.push("//*[@id='bk101']");
      xpath.push("//*[@id='bk102']");
      actualDiv = "#div_S3";
      return sign(plainXML, xpath, window.RSASSA_Ver, window.RSASSA_Sign, referenceXML, "env").then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Sign_OneChildElement = function() {
    return $.get(documentRoot + refenceDocument3, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Signature/Enveloped/One_Child_Element.xml";
      xpath.push("//*[@id='bk101']/author");
      actualDiv = "#div_S4";
      return sign(plainXML, xpath, window.RSASSA_Ver, window.RSASSA_Sign, referenceXML, "env").then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Sign_AllBookElements = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Signature/Enveloped/All_Book_Elements.xml";
      xpath.push("//*[local-name()='book']");
      actualDiv = "#div_S5";
      return sign(plainXML, xpath, window.RSASSA_Ver, window.RSASSA_Sign, referenceXML, "env").then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_SignDetached_Complete_Document = function() {
    return $.get(documentRoot + refenceDocument3, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Signature/Detached/Complete_Document.xml";
      xpath.push("/*");
      actualDiv = "#div_SD1";
      return sign(plainXML, xpath, window.RSASSA_Ver, window.RSASSA_Sign, referenceXML, "det").then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_SignDetached_OneElementById = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Signature/Detached/One_Element_By_ID.xml";
      xpath.push("//*[@id='bk101']");
      actualDiv = "#div_SD2";
      return sign(plainXML, xpath, window.RSASSA_Ver, window.RSASSA_Sign, referenceXML, "det").then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_SignDetached_TwoElementsById = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Signature/Detached/Two_Elements_By_ID.xml";
      xpath.push("//*[@id='bk101']");
      xpath.push("//*[@id='bk102']");
      actualDiv = "#div_SD3";
      return sign(plainXML, xpath, window.RSASSA_Ver, window.RSASSA_Sign, referenceXML, "det").then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_SignDetached_OneChildElement = function() {
    return $.get(documentRoot + refenceDocument3, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Signature/Detached/One_Child_Element.xml";
      xpath.push("//*[@id='bk101']/author");
      actualDiv = "#div_SD4";
      return sign(plainXML, xpath, window.RSASSA_Ver, window.RSASSA_Sign, referenceXML, "det").then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_SignDetached_AllBookElements = function() {
    return $.get(documentRoot + refenceDocument, function(data) {
      var actualDiv, plainXML, referenceXML, xpath;
      plainXML = data;
      xpath = [];
      referenceXML = documentRoot + "/Signature/Detached/All_Book_Elements.xml";
      xpath.push("//*[local-name()='book']");
      actualDiv = "#div_SD5";
      return sign(plainXML, xpath, window.RSASSA_Ver, window.RSASSA_Sign, referenceXML, "det").then(function(documents) {
        return compare(documents[0], documents[1], actualDiv);
      });
    });
  };

  test_Verify_Complete_Document = function() {
    return $.get(documentRoot + "/Verification/Enveloped/Complete_Document.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_V1";
      return verify(signedXML, actualDiv);
    });
  };

  test_Verify_MAC_Complete_Document = function() {
    return $.get(documentRoot + "/Verification/Enveloped/Complete_Document_MAC.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_VM1";
      return verify(signedXML, actualDiv, false, true);
    });
  };

  test_Verify_OneElementById = function() {
    return $.get(documentRoot + "/Verification/Enveloped/One_Element_By_ID.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_V2";
      return verify(signedXML, actualDiv);
    });
  };

  test_Verify_TwoElementsById = function() {
    return $.get(documentRoot + "/Verification/Enveloped/Two_Elements_By_ID.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_V3";
      return verify(signedXML, actualDiv);
    });
  };

  test_Verify_OneChildElement = function() {
    return $.get(documentRoot + "/Verification/Enveloped/One_Child_Element.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_V4";
      return verify(signedXML, actualDiv);
    });
  };

  test_Verify_AllBookElements = function() {
    return $.get(documentRoot + "/Verification/Enveloped/All_Book_Elements.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_V5";
      return verify(signedXML, actualDiv);
    });
  };

  test_VerifyDetached_Complete_Document = function() {
    return $.get(documentRoot + "/Verification/Detached/Complete_Document.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_VD1";
      return verify(signedXML, actualDiv);
    });
  };

  test_VerifyDetached_OneElementById = function() {
    return $.get(documentRoot + "/Verification/Detached/One_Element_By_ID.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_VD2";
      return verify(signedXML, actualDiv);
    });
  };

  test_VerifyDetached_TwoElementsById = function() {
    return $.get(documentRoot + "/Verification/Detached/Two_Elements_By_ID.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_VD3";
      return verify(signedXML, actualDiv);
    });
  };

  test_VerifyDetached_OneChildElement = function() {
    return $.get(documentRoot + "/Verification/Detached/One_Child_Element.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_VD4";
      return verify(signedXML, actualDiv);
    });
  };

  test_VerifyDetached_AllBookElements = function() {
    return $.get(documentRoot + "/Verification/Detached/All_Book_Elements.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_VD5";
      return verify(signedXML, actualDiv);
    });
  };

  test_Verify_NegativeDigest = function() {
    return $.get(documentRoot + "/Verification/Enveloped/NegativeDigest.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_VN1";
      return verify(signedXML, actualDiv, true);
    });
  };

  test_Verify_NegativeSignatureValue = function() {
    return $.get(documentRoot + "/Verification/Enveloped/NegativeSignatureValue.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_VN2";
      return verify(signedXML, actualDiv, true);
    });
  };

  test_Verify_Negative_WrongKey = function() {
    return $.get(documentRoot + "/Verification/Enveloped/NegativeSignatureValue.xml", function(data) {
      var actualDiv, signedXML;
      signedXML = data;
      actualDiv = "#div_VN3";
      return verify(signedXML, actualDiv, true);
    });
  };

  visualisation = function(actualDiv, result) {
    if (result) {
      return $(actualDiv).css("background-color", "lime");
    } else {
      $(actualDiv).css("background-color", "red");
      return console.log("Test " + $(actualDiv)[0].innerText + " NICHT erfolgreich");
    }
  };

  compare = function(createdDoc, referenceXML, actualDiv) {
    return $.get(referenceXML, function(compare) {
      var compareStr, createdDocStr, parser, serializer;
      if (createdDoc.firstChild.nodeType === 10) {
        createdDoc.firstChild.remove();
      }
      if (compare.firstChild.nodeType === 10) {
        compare.firstChild.remove();
      }
      serializer = new XMLSerializer;
      createdDocStr = serializer.serializeToString(createdDoc);
      createdDocStr = createdDocStr.replace(/\r?\n|\r/g, '');
      createdDocStr = createdDocStr.replace(/\>\s+\</g, '><');
      compareStr = serializer.serializeToString(compare);
      compareStr = compareStr.replace(/\r?\n|\r/g, '');
      compareStr = compareStr.replace(/\>\s+\</g, '><');
      parser = new DOMParser();
      createdDoc = parser.parseFromString(createdDocStr, "text/xml");
      compare = parser.parseFromString(compareStr, "text/xml");
      if (createdDoc.documentElement.isEqualNode(compare.documentElement)) {
        return visualisation(actualDiv, true);
      } else {
        return visualisation(actualDiv, false);
      }
    });
  };

  encrypt = function(plainXML, xPath, key, referenceXML, KeyName, asymKey, withKeyInfo, staticIV) {
    var encParams, encryptedXML, i, j, ref, reference, references, that;
    references = [];
    encryptedXML = new EncryptedXML();
    for (i = j = 0, ref = xPath.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      reference = new Reference(xPath[i]);
      references.push(reference);
    }
    that = this;
    encParams = new EncryptionParams;
    encParams.setPublicKey(asymKey, KeyName);
    encParams.setSymmetricKey(key);
    encParams.setReferences(references);
    encParams.setStaticIV(true);
    return encryptedXML.encrypt(plainXML, encParams.getEncryptionInfo()).then(function(encrypted) {
      return [encrypted, referenceXML];
    });
  };

  sign = function(plainXML, xPath, publicKey, privateKey, referenceXML, sigType, MAC) {
    var digestAlg, i, j, ref, reference, references, signatureParams, signedXML, that, transforms;
    references = [];
    transforms = [Algorithms.TransformAlgorithms.C14N];
    digestAlg = Algorithms.DigestAlgorithms.SHA1;
    for (i = j = 0, ref = xPath.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      reference = new Reference(xPath[i], transforms, digestAlg);
      references.push(reference);
    }
    that = this;
    signatureParams = new SignatureParams;
    if (!MAC) {
      signatureParams.setSigAlg(Algorithms.SigningAlgorithms.RSA.SHA1);
    } else {
      signatureParams.setSigAlg(Algorithms.SigningAlgorithms.HMAC.SHA1);
    }
    signatureParams.setReferences(references);
    signatureParams.setKeyPair(publicKey, privateKey);
    signatureParams.setPrefix("ds");
    signatureParams.setCanonicalisationAlg(Algorithms.TransformAlgorithms.C14N);
    if (sigType === "env") {
      signatureParams.setSignatureType(XMLSecEnum.signatureTypesEnum.Enveloped);
    }
    if (sigType === "det") {
      signatureParams.setSignatureType(XMLSecEnum.signatureTypesEnum.Detached);
    }
    signedXML = new SignedXML();
    return signedXML.sign(plainXML, signatureParams.getSignatureParams()).then(function(signed) {
      return [signed, referenceXML];
    });
  };

  verify = function(signedXML, actualDiv, negative, MAC) {
    var key, sigVerifier;
    sigVerifier = new SignedXML();
    if (!MAC) {
      return sigVerifier.loadKey(signedXML).then(function(key) {
        return sigVerifier.verify(signedXML, key).then(function(verification) {
          if (!negative) {
            return visualisation(actualDiv, verification.result);
          } else if (negative) {
            return visualisation(actualDiv, !verification.result);
          }
        });
      });
    } else {
      key = window.HMAC;
      return sigVerifier.verify(signedXML, key).then(function(verification) {
        if (!negative) {
          return visualisation(actualDiv, verification.result);
        } else if (negative) {
          return visualisation(actualDiv, !verification.result);
        }
      });
    }
  };

  decrypt = function(cipherXML, key, referenceXML) {
    var encryptedXML, references;
    references = [];
    encryptedXML = new EncryptedXML();
    return encryptedXML.decrypt(cipherXML, key).then(function(decrypted) {
      return [decrypted, referenceXML];
    });
  };

}).call(this);

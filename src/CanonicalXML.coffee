window.setImmediate = require('timers').setImmediate;
c14n = require("xml-c14n")()

class window.CanonicalXML
  CanonicalisationMethod : "http://www.w3.org/2001/10/xml-exc-c14n#WithComments"

  ###
  Erzeugt einen neuen Canonicalisierer
  ###
  constructor : (Algorithm) -> # Algorithm is ignored for now, default is used
    @can = c14n.createCanonicaliser @CanonicalisationMethod
  
  ###
  Erzeugt einen Promise für ein neues canonicalisiertes XML document
  ###
  canonicalise : (RawXML) ->
    can = @can
    new Promise (resolve, reject) ->
      can.canonicalise RawXML, (err, res) ->
        if err
          reject(err)
        else
          resolve(res)

class window.CanonicalXML
  RawXML : ""
  CanonXML : ""
  CanonicalisationMethod : "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"

  ###
  Erzeugt ein Neues Caninicalisiertes XML document
  ###
  constructor : (@RawXML, Algorithm) ->
    ###
    can = new Canonicalisation_Module_Incl
    namespaces = {inclusiveNamespacesPrefixList:"ds"}
    @CanonXML = can.createCanonicaliser("http://www.w3.org/TR/2001/REC-xml-c14n-20010315").canonicalise(@RawXML,namespaces)
    #@CanonXML=@CanonXML.replace(/>\s*</g,"><")
    #@CanonicalXML = $.parseXML(@CanonicalXML)

    ###
    can = new Canonicalisation_Module.ExclusiveCanonicalizationWithComments
    #namespaces = {inclusiveNamespacesPrefixList:"ds"}
    @CanonXML = can.process(@RawXML)
    @CanonicalisationMethod = can.getAlgorithmName()

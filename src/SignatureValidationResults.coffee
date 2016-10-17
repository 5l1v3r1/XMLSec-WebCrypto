###
Provides an object with information about the verification process
###
class window.SignatureValidationResults

  constructor:()->
    @result="" # The result (true or false)
    @validatedSignature="" # The Signature Element that was verified
    @validatedReferences = [] # The list of all validated references
    @validationErrors = [] # A list of all validation errors

  ###
  Sets the result
  result: true or false
  ###
  setResult : (result) ->
    @result = result

  ###
  Adds a Validated Reference to the list
  reference: one reference Object
  node: The reference node
  error: An errormassage
  ###
  addValidatedReference : (reference,node,error) ->
    #Object that holds information about the reference
    validatedReference = {
      reference:"",
      node : ""
      error : ""
    }
    validatedReference.reference = reference
    validatedReference.node = node
    validatedReference.error = error
    #If there was an error during verification put it in the list
    if error or error != ""
      @validationErrors.push(error)
    @validatedReferences.push(validatedReference)

  ###
  Puts a list of elements into the Variable
  references: A List holding array with[referenceObject, node error]
  ###
  setReferences : (references)->
    for i in [0..references.length-1]
      @addValidatedReference(references[i][0],references[i][1],references[i][2])
    return @validatedReferences

  ###
  Put the signature element in the object
  signature: Signature node
  ###
  setValidatedSignature : (signature) ->
    @validatedSignature=signature

  ###
  Adds an error to the errorList
  error: Errormassage as string
  ###
  addValidationErrors:(error) ->
    if error or error != ""
      @validationErrors.push(error)

  ###
  returns an Object providing all required information
  ###
  getResults:()->
    results={
      result:@result,
      validatedReferences:@validatedReferences,
      validatedSignature:@validatedSignature,
      validationErrors:@validationErrors
    }

  ###
  Returns the result
  ###
  getResult:() ->
    @result

  ###
  Returns a list with all Validation errors
  ###
  getValidationErrors:() ->
    @validationErrors

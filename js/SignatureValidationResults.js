
/*
Provides an object with information about the verification process
 */

(function() {
  window.SignatureValidationResults = (function() {
    function SignatureValidationResults() {
      this.result = "";
      this.validatedSignature = "";
      this.validatedReferences = [];
      this.validationErrors = [];
    }


    /*
    Sets the result
    result: true or false
     */

    SignatureValidationResults.prototype.setResult = function(result) {
      return this.result = result;
    };


    /*
    Adds a Validated Reference to the list
    reference: one reference Object
    node: The reference node
    error: An errormassage
     */

    SignatureValidationResults.prototype.addValidatedReference = function(reference, node, error) {
      var validatedReference;
      validatedReference = {
        reference: "",
        node: "",
        error: ""
      };
      validatedReference.reference = reference;
      validatedReference.node = node;
      validatedReference.error = error;
      if (error || error !== "") {
        this.validationErrors.push(error);
      }
      return this.validatedReferences.push(validatedReference);
    };


    /*
    Puts a list of elements into the Variable
    references: A List holding array with[referenceObject, node error]
     */

    SignatureValidationResults.prototype.setReferences = function(references) {
      var i, j, ref;
      for (i = j = 0, ref = references.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        this.addValidatedReference(references[i][0], references[i][1], references[i][2]);
      }
      return this.validatedReferences;
    };


    /*
    Put the signature element in the object
    signature: Signature node
     */

    SignatureValidationResults.prototype.setValidatedSignature = function(signature) {
      return this.validatedSignature = signature;
    };


    /*
    Adds an error to the errorList
    error: Errormassage as string
     */

    SignatureValidationResults.prototype.addValidationErrors = function(error) {
      if (error || error !== "") {
        return this.validationErrors.push(error);
      }
    };


    /*
    returns an Object providing all required information
     */

    SignatureValidationResults.prototype.getResults = function() {
      var results;
      return results = {
        result: this.result,
        validatedReferences: this.validatedReferences,
        validatedSignature: this.validatedSignature,
        validationErrors: this.validationErrors
      };
    };


    /*
    Returns the result
     */

    SignatureValidationResults.prototype.getResult = function() {
      return this.result;
    };


    /*
    Returns a list with all Validation errors
     */

    SignatureValidationResults.prototype.getValidationErrors = function() {
      return this.validationErrors;
    };

    return SignatureValidationResults;

  })();

}).call(this);

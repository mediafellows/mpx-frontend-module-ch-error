angular.module("mpx-frontend-module-ch-error").factory 'ChError', ->
  class ChError
    description: 'Something went wrong'

    constructor: (@resultError) ->
      @headers = @resultError.headers
      @status  = @resultError.statusCode
      @errors  = @resultError.object && @resultError.object.payload || {}

      switch @resultError.statusCode
        when 0   then @description = 'No response, timeout'
        when 401 then @description = 'Authentication required'
        when 403 then @description = 'You are not authorized to perform this operation'
        when 404 then @description = 'Resource not found'
        when 405 then @description = 'You can not perform this operation on this entity'
        when 422 then @description = 'Validation error'

      if @resultError.object && @resultError.object.description
        @description = @resultError.object.description

# returns an error handler for chinchilla's ErrorResult
# if you invoke it with a model instance it will try to map response payload errors (validation errors)
# to this model, e.g.
#   ChErrorHandler($scope.user)(errorResult)
#
# you can also add a default error message if you want. If you don't give it an error message it will
# toast one depending on the result status code, e.g.
#   ChErrorHandler($scope.user, 'Your error message')(resultError)
#
# if you don't have a model you can still use it for toasting error messages
#   ChErrorHandler()(resultError)
#   ChErrorHandler(null, 'Your message')(resultError)
angular.module("mpx-frontend-module-ch-error").factory 'ChErrorHandler', (ChError, Toastr) ->
  (model, errorMsg) ->
    (errorResult) ->
      chError = new ChError(errorResult)

      mapToModel = ->
        _.each chError.errors, (value, key) ->
          if /\./.test(key)
            mapToNestedModel(value, key)
          else
            mapToAttribute(value, key, model)

      mapToNestedModel = (value, key) ->
        [head, tail] = key.split('.')
        mapToAttribute(value, tail, model[head]) if model[head]

      mapToAttribute = (value, key, model) ->
        model.errors ||= {}

        # always map to diect attribute name
        model['errors'][key] = value

        # also map to assoc. accessors if exist
        if _.has(model, "#{key}_id")
          model['errors']["#{key}_id"] = value

        else if _.has(model, "#{key}_ids")
          model['errors']["#{key}_ids"] = value


      # if model is present and errors reported - map errors, otherwise show notification
      if model && !_.isEmpty(chError.errors)
        mapToModel()
      else
        Toastr.error(errorMsg || chError.description)

angular.module("mpx-frontend-module-ch-error").factory 'ChErrorRedirect', ($state, ChError, Toastr) ->
  (errorResult) ->
    chError = new ChError(errorResult)

    switch chError.status
      when 403 then $state.go('signedIn.forbidden')
      when 404 then $state.go('signedIn.resourceNotFound')
      else
        Toastr.warning(chError.description)

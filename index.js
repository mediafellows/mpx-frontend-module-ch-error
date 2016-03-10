(function() {
  angular.module('mpx-frontend-module-ch-error', []);

}).call(this);

(function() {
  angular.module("mpx-frontend-module-ch-error").factory('ChError', function() {
    var ChError;
    return ChError = (function() {
      ChError.prototype.description = 'Something went wrong';

      function ChError(resultError) {
        this.resultError = resultError;
        this.headers = this.resultError.headers;
        this.status = this.resultError.statusCode;
        this.errors = this.resultError.object && this.resultError.object.payload || {};
        switch (this.resultError.statusCode) {
          case 0:
            this.description = 'No response, timeout';
            break;
          case 401:
            this.description = 'Authentication required';
            break;
          case 403:
            this.description = 'You are not authorized to perform this operation';
            break;
          case 404:
            this.description = 'Resource not found';
            break;
          case 405:
            this.description = 'You can not perform this operation on this entity';
            break;
          case 422:
            this.description = 'Validation error';
        }
        if (this.resultError.object && this.resultError.object.description) {
          this.description = this.resultError.object.description;
        }
      }

      return ChError;

    })();
  });

  angular.module("mpx-frontend-module-ch-error").factory('ChErrorHandler', ["ChError", "Toastr", function(ChError, Toastr) {
    return function(model, errorMsg) {
      return function(errorResult) {
        var chError, mapToAttribute, mapToModel, mapToNestedModel;
        chError = new ChError(errorResult);
        mapToModel = function() {
          return _.each(chError.errors, function(value, key) {
            if (/\./.test(key)) {
              return mapToNestedModel(value, key);
            } else {
              return mapToAttribute(value, key, model);
            }
          });
        };
        mapToNestedModel = function(value, key) {
          var head, ref, tail;
          ref = key.split('.'), head = ref[0], tail = ref[1];
          if (model[head]) {
            return mapToAttribute(value, tail, model[head]);
          }
        };
        mapToAttribute = function(value, key, model) {
          model.errors || (model.errors = {});
          model['errors'][key] = value;
          if (_.has(model, key + "_id")) {
            return model['errors'][key + "_id"] = value;
          } else if (_.has(model, key + "_ids")) {
            return model['errors'][key + "_ids"] = value;
          }
        };
        if (model && !_.isEmpty(chError.errors)) {
          return mapToModel();
        } else {
          return Toastr.error(errorMsg || chError.description);
        }
      };
    };
  }]);

  angular.module("mpx-frontend-module-ch-error").factory('ChErrorRedirect', ["$state", "ChError", "Toastr", function($state, ChError, Toastr) {
    return function(errorResult) {
      var chError;
      chError = new ChError(errorResult);
      switch (chError.status) {
        case 403:
          return $state.go('signedIn.forbidden');
        case 404:
          return $state.go('signedIn.resourceNotFound');
        default:
          return Toastr.warning(chError.description);
      }
    };
  }]);

}).call(this);

(function() {
  angular.module("mpx-frontend-module-ch-error").factory('Toastr', function() {
    return {
      success: function(msg, title, options) {
        var opts;
        if (title == null) {
          title = null;
        }
        opts = _.extend({
          closeButton: true,
          timeOut: 6000
        }, options || {});
        return toastr.success(msg, title, opts);
      },
      info: function(msg, title, options) {
        var opts;
        if (title == null) {
          title = null;
        }
        opts = _.extend({
          closeButton: true
        }, options || {});
        return toastr.info(msg, title, opts);
      },
      warning: function(msg, title, options) {
        var opts;
        if (title == null) {
          title = null;
        }
        opts = _.extend({
          closeButton: true,
          timeOut: 10000
        }, options || {});
        return toastr.warning(msg, title, opts);
      },
      error: function(msg, title, options) {
        var opts;
        if (title == null) {
          title = null;
        }
        opts = _.extend({
          closeButton: true,
          timeOut: 864000
        }, options || {});
        return toastr.error(msg, title, opts);
      }
    };
  });

}).call(this);

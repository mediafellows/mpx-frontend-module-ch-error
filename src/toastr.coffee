angular.module("mpx-frontend-module-ch-error").factory 'Toastr', ->
  success: (msg, title = null, options) ->
    opts = _.extend({ closeButton: true, timeOut: 6000 }, options || {})
    toastr.success(msg, title, opts)

  info: (msg, title = null, options) ->
    opts = _.extend({ closeButton: true }, options || {})
    toastr.info(msg, title, opts)

  warning: (msg, title = null, options) ->
    opts = _.extend({ closeButton: true, timeOut: 10000 }, options || {})
    toastr.warning(msg, title, opts)

  error: (msg, title = null, options) ->
    opts = _.extend({ closeButton: true, timeOut: 864000 }, options || {})
    toastr.error(msg, title, opts)

functionCall <- function(func, ...) {
  invisible(do.call(func, list(...)))
}

serializeS3SingleValue <- function(val) {
  serializedVal <- tryCatch({
    jsonlite::toJSON(val)
    val
  }, error = function(e) {
    jsonlite::serializeJSON(val)
  })
  return(serializedVal)
}

serializeS3Values <- function(values) {
  serializedValues <- lapply(values, serializeS3SingleValue)
  return(serializedValues)
}

unserializeS3SingleValue <- function(val) {
  charVal <- paste(val)
  unserializedVal <- tryCatch({
    jsonlite::unserializeJSON(charVal)
  }, error = function(e) {
    val
  })
  return(unserializedVal)
}

unserializeS3Values <- function(values) {
  unserializedValues <- lapply(values, unserializeS3SingleValue)
  return(unserializedValues)
}

evaluateArgList <- function(args) {
  evaluated <- lapply(args, function(arg) { eval(parse(text=arg)) })
  return(evaluated)
}

functionCall <- function(func, argsToEvaluate, ...) {
  inputs <- list(...)
  unserializedInputs <- unserializeS3Values(inputs)

  evaluated <- evaluateArgList(argsToEvaluate)
  allArgs <- append(unserializedInputs, evaluated)

  returnValues <- do.call(func, allArgs)

  serializedReturnValues <- serializeS3Values(returnValues)
  invisible(serializedReturnValues)
}

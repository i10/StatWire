serializeSingleValue <- function(val) {
  return(as.character(serialize(val, NULL)))
}

serializeValues <- function(values) {
  serializedValues <- lapply(values, serializeSingleValue)
  return(serializedValues)
}

unserializeSingleValue <- function(val) {
  rawVector <- as.raw(as.hexmode(val))
  return(unserialize(rawVector))
}

unserializeValues <- function(values) {
  unserializedValues <- lapply(values, unserializeSingleValue)
  return(unserializedValues)
}

evaluateArgList <- function(args) {
  evaluated <- lapply(args, function(arg) { eval(parse(text=arg)) })
  return(evaluated)
}

functionCall <- function(func, serializedArgs, argsToEvaluate, ...) {
  files <- list(...)
  unserializedInputs <- unserializeValues(serializedArgs)

  evaluated <- evaluateArgList(argsToEvaluate)
  allArgs <- append(append(unserializedInputs, evaluated), files)

  returnValues <- do.call(func, allArgs)

  serializedReturnValues <- serializeValues(returnValues)
  invisible(serializedReturnValues)
}

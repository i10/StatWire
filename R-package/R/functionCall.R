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

getSerializedWithRepresentation <- function(args) {
  serializedReturnValues <- serializeValues(args)
  representations <- lapply(args, function(arg) { capture.output(arg)})
  zipped <- mapply(list, serializedReturnValues, representations, SIMPLIFY = FALSE);
  return(zipped)
}

functionCall <- function(func, serializedArgs, argsToEvaluate, ...) {
  files <- list(...)
  unserializedInputs <- unserializeValues(serializedArgs)

  evaluated <- evaluateArgList(argsToEvaluate)
  allArgs <- append(append(unserializedInputs, evaluated), files)

  returnValues <- do.call(func, allArgs)


  returnArray <- getSerializedWithRepresentation(returnValues)
  invisible(returnArray)
}

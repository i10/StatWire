library(jsonlite)

serializeS3SingleValue <- function(val) {
  serializedVal <- tryCatch({
    toJSON(val)
    val
  }, error = function(e) {
    serializeJSON(val)
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
    unserializeJSON(charVal)
  }, error = function(e) {
    val
  })
  return(unserializedVal)
}

unserializeS3Values <- function(values) {
  unserializedValues <- lapply(values, unserializeS3SingleValue)
  return(unserializedValues)
}

functionCall <- function(func, ...) {
  inputs <- list(...)
  unserializedInputs <- unserializeS3Values(inputs)

  returnValues <- do.call(func, unserializedInputs)

  serializedReturnValues <- serializeS3Values(returnValues)
  r(serializedReturnValues)
}

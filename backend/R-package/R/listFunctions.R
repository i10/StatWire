reformat <- function(item) {
  # Output template (http://plnkr.co/edit/6MVntVmXYUbjR0DI82Cr?p=preview):
  # {
  #      name: ea.word,
  #      value: ea.word,
  #      score: ea.score,
  #      meta: "rhyme"
  # }
  newItem <- vector(mode="list");

  newItem$name <- item
  newItem$value <- item
  newItem$score <- 1
  newItem$meta <- "r"

  return(newItem);
}


listFunctions <- function(prefix=NULL) {
  # https://stackoverflow.com/questions/4267744/is-there-a-way-to-get-a-vector-with-the-name-of-all-functions-that-one-could-use
  pkgs <- search();
  # pkgs = .packages(all.available = TRUE);

  pkgs <- pkgs[grep("package:", pkgs)];

  functions <- unname(unlist(sapply(pkgs, lsf.str)));

  # filter if necessary
  if (!is.null(prefix)) {
    functions <- grep(paste0("^", prefix), functions, perl=TRUE, value=TRUE)
  }

  functions <- lapply(functions, reformat);

  invisible(functions);
}

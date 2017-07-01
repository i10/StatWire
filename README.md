# StatLets
An IDE facilitating statistical analysis by providing a node editor
to enhance R.

Understand that this app was only tested with [Chrome] (v59).
Other browsers might cause issues.

This project was generated with [Angular CLI] version 1.1.3.

## Installation
### Prerequisites
Install the following development tools:

1. [R]. (Note: Installing [RStudio] also installs R.)
2. [Node] and [npm]. (Note: Installing Node also installs npm.)
3. [Angular CLI]. (Note: Use `npm install -g @angular/cli` in the terminal.)

### StatLets
To install the app itself:

1. Install the [OpenCPU] R package in an R terminal, using
   `install.packages("opencpu")`.
2. Install the app's dependencies, using `npm install`.
3. Install the StatLets R package, found in `./R-package`, in an R terminal
   using `install.packages(".", repos = NULL, type="source")`.
   - Make sure the working directory is set to `./R-package`.
   - Reinstall StatLets's R package whenever it is changed
     (e.g., a new R function is added).

## Development server
The app consists of two parts.

1. To start the [OpenCPU] backend, which executes the R code,
   open an R terminal and run
   ```
   library(opencpu)
   ocpu_start_server()
   ```
2. Run `ng serve` for a dev server. Navigate to http://localhost:4200/.
   The app will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component.
You can also use `ng generate directive|pipe|service|class|module`.

## Build
Run `ng build` to build the project. The build artifacts will be stored
in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests
Run `ng test` to execute the unit tests via [Karma].

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor].
Before running the tests make sure you are serving the app via `ng serve`.

## Further help
To get more help on the Angular CLI use `ng help`
or go check out the [Angular CLI README].

[R]: https://cran.r-project.org/mirrors.html
[RStudio]: https://www.rstudio.com/products/rstudio/#Desktop
[Node]: https://https://nodejs.org/en/
[npm]: https://www.npmjs.com
[Chrome]: https://www.google.com/chrome/browser/desktop/index.html
[Angular CLI]: https://github.com/angular/angular-cli
[OpenCPU]: https://www.opencpu.org/
[Karma]: https://karma-runner.github.io
[Protractor]: http://www.protractortest.org/
[Angular CLI README]: https://github.com/angular/angular-cli/blob/master/README.md

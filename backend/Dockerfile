FROM opencpu/rstudio:latest

ADD ./R-package /usr/lib/R-package
WORKDIR /usr/lib/R-package
RUN R -e 'library(devtools); install()'

ADD ./scripts /src/
WORKDIR /src

EXPOSE 5656

CMD ["Rscript", "./startOpenCPU.R"]

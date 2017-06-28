import { ElementRef, Injectable } from '@angular/core';

declare const jsPlumb;

@Injectable()
export class PlumbingService {
  private jsPlumb = jsPlumb.getInstance();

  makeDraggable(element: ElementRef): void {
    this.jsPlumb.draggable(element, {
      containment: true,
    })
  }

  makeInput(element: ElementRef): void {
    const inputEndpointOptions = {
      anchor: 'Left',
      maxConnections: 1,
      paintStyle: {
        fill: 'transparent',
      },
    };
    this.jsPlumb.makeTarget(element, inputEndpointOptions)
  }

  makeOutput(element: ElementRef): void {
    const outputEndpointOptions = {
      anchor: 'Right',
      paintStyle: {
        fill: 'transparent',
      },
    };
    this.jsPlumb.makeSource(element, outputEndpointOptions);
  }

  setContainer(element: ElementRef): void {
    this.jsPlumb.setContainer(element);
  }

  onConnection(callback): void {
    this.jsPlumb.bind('connection', callback);
  }
}

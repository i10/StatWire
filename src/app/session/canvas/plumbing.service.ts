import { Injectable } from '@angular/core';

declare const jsPlumb;

@Injectable()
export class PlumbingService {
  private jsPlumb = jsPlumb.getInstance();

  makeDraggable(elementId: string): void {
    this.jsPlumb.draggable(elementId, {
      containment: true,
    })
  }

  makeInput(elementId: string): void {
    const inputEndpointOptions = {
      anchor: 'Left',
      maxConnections: 1,
      paintStyle: {
        fill: 'transparent',
      },
    };
    this.jsPlumb.makeTarget(elementId, inputEndpointOptions)
  }

  makeOutput(elementId: string): void {
    const outputEndpointOptions = {
      anchor: 'Right',
      paintStyle: {
        fill: 'transparent',
      },
    };
    this.jsPlumb.makeSource(elementId, outputEndpointOptions);
  }

  setContainer(elementId: string): void {
    this.jsPlumb.setContainer(elementId);
  }

  onConnection(callback): void {
    this.jsPlumb.bind('connection', callback);
  }
}

import { Injectable } from '@angular/core';

declare const jsPlumb;
declare const $;

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
      endpoint: ['Dot', {radius: 5}],
      paintStyle: { fill: 'rgba(66,139,202,1)' },
      maxConnections: 1,
    };
    this.jsPlumb.makeTarget(elementId, inputEndpointOptions)
  }

  makeOutput(elementId: string): void {
    const outputEndpointOptions = {
      anchor: 'Right',
      endpoint: ['Dot', {radius: 5}],
      paintStyle: { fill: 'rgba(66,139,202,1)' },
    };
    this.jsPlumb.makeSource(elementId, outputEndpointOptions);
  }

  setContainer(elementId: string): void {
    this.jsPlumb.setContainer(elementId);
  }

  makeGroup(elementId: string): void {
    console.log(elementId)
    const element = $('#'+elementId);
    this.jsPlumb.addGroup({el: element, id: elementId, title: "test"});
  }

  onConnection(callback): void {
    this.jsPlumb.bind('connection', callback);
  }

  onDisconnect(callback): void {
    this.jsPlumb.bind('connectionDetached', callback);
  }

  removeAllConnectionsFrom(id: string): void {
    this.jsPlumb.removeAllEndpoints(id);
  }

  updateEndpoints(id: string): void {
    this.jsPlumb.revalidate(id);
  }
}

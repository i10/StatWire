import { Injectable } from '@angular/core';
import { CanvasPosition } from '../../model/nodes/canvas-position';

declare const jsPlumb;

@Injectable()
export class PlumbingService {
  private jsPlumb = jsPlumb.getInstance();

  makeDraggable(elementId: string, onStopCallback = null): void {
    this.jsPlumb.draggable(elementId, {
      containment: true,
      stop: (params) => {
        const element = params.el;
        onStopCallback(new CanvasPosition(element.offsetLeft, element.offsetTop));
      },
    })
  }

  makeInput(elementId: string): void {
    const inputEndpointOptions = {
      isTarget: true,
      anchor: 'Left',
      endpoint: ['Dot', {radius: 5}],
      endpointStyle: {fill: 'rgba(66,139,202,1'},
      connectorPaintStyle: {fill: 'rgba(66,139,202,1)'},
      maxConnections: 1,
      connector: ['Bezier', {curviness: 100}],
    };
    this.jsPlumb.addEndpoint(elementId, inputEndpointOptions)
  }

  makeOutput(elementId: string): void {
    const outputEndpointOptions = {
      isSource: true,
      maxConnections: -1,
      anchor: 'Right',
      endpoint: ['Dot', {radius: 5}],
      endpointStyle: {fill: 'rgba(66,139,202,1'},
      connectorPaintStyle: {fill: 'rgba(66,139,202,1)'},
      connector: ['Bezier', {curviness: 100}],
    };
    this.jsPlumb.addEndpoint(elementId, outputEndpointOptions);
  }

  setContainer(elementId: string): void {
    this.jsPlumb.setContainer(elementId);
  }

  onConnection(callback): void {
    this.jsPlumb.bind('connection', callback);
  }

  onDisconnect(callback): void {
    this.jsPlumb.bind('connectionDetached', callback);
  }

  connect(sourceId: string, targetId: string) {
    this.jsPlumb.connect({
      source: sourceId,
      target: targetId,
      endpoint: ['Dot', {radius: 5}],
      endpointStyle: {fill: 'rgba(66,139,202,1'},
      connectorPaintStyle: {fill: 'rgba(66,139,202,1'},
      connector: ['Bezier', {curviness: 10}],
    })
  }

  removeAllConnectionsFrom(id: string): void {
    this.jsPlumb.removeAllEndpoints(id);
  }

  repaintEverything(): void {
    this.jsPlumb.repaintEverything();
  }
}

import { Component, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { RemoteRService } from '../../../remote-r.service';
import { PlumbingService } from '../plumbing.service';
import { Statlet } from '../../../model/statlet';
import { CanvasPosition } from '../../../model/canvas-position';

const enum NodeState {
  ready,
  busy,
}

@Component({
  selector: 'sl-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent implements OnInit {
  nodeState: NodeState = NodeState.ready;
  @Input() statlet: Statlet;
  @Output() onSelected: EventEmitter<Statlet> = new EventEmitter();

  constructor(
    private plumbing: PlumbingService,
    private remoteR: RemoteRService,
    private element: ElementRef,
  ) { }

  ngOnInit() {
    this.moveNodeToPosition(this.element, this.statlet.position);
    this.makeDraggable(this.element);
  }

  private moveNodeToPosition(element: ElementRef, position: CanvasPosition): void {
    element.nativeElement.attr(
      'style',
      `left: ${position.x}px; top: ${position.y}px;`
    );
  }

  private makeDraggable(element: ElementRef): void {
    this.plumbing.makeDraggable(element);
  }

  execute(): void {
    this.nodeState = NodeState.busy;
    this.remoteR.execute(
      this.statlet.code,
      this.statlet.inputList,
    ).then(outputs => {
      this.updateStatletOutputsWithOpenCpuOutput(outputs);
      this.nodeState = NodeState.ready;
    }).catch(() => {
      this.nodeState = NodeState.ready;
    })
  }

  private updateStatletOutputsWithOpenCpuOutput(outputs: any[]): void {
    for (let index = 0; index < outputs.length; index++) {
      this.statlet.outputList.get(index).value = outputs[index];
    }
  }
}

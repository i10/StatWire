import { AfterViewInit, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

import { RemoteRService } from '../../../remote-r.service';
import { PlumbingService } from '../plumbing.service';
import { Statlet } from '../../../model/statlet';

enum NodeState {
  ready,
  busy,
}

@Component({
  selector: 'sl-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent implements OnInit, AfterViewInit {
  NodeState = NodeState;  // Make enum available in template
  currentState: NodeState = NodeState.ready;
  @Input() statlet: Statlet;
  @Output() onSelected: EventEmitter<Statlet> = new EventEmitter();
  @HostBinding('id') htmlId: string;

  constructor(
    private plumbing: PlumbingService,
    private remoteR: RemoteRService,
  ) { }

  ngOnInit() {
    this.htmlId = `node-${this.statlet.id}`;
  }

  ngAfterViewInit() {
    this.makeDraggable(this.htmlId);
  }

  private makeDraggable(elementId: string): void {
    this.plumbing.makeDraggable(elementId);
  }

  execute(): void {
    this.currentState = NodeState.busy;
    this.remoteR.execute(
      this.statlet.code,
      this.statlet.inputList,
    ).then(outputs => {
      this.updateStatletOutputsWithOpenCpuOutput(outputs);
      this.currentState = NodeState.ready;
    }).catch(() => {
      this.currentState = NodeState.ready;
    })
  }

  private updateStatletOutputsWithOpenCpuOutput(outputs: any[]): void {
    for (let index = 0; index < outputs.length; index++) {
      this.statlet.outputList.get(index).value = outputs[index];
    }
  }

  selected(): void {
    this.onSelected.emit(this.statlet);
  }
}

import { AfterViewInit, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Statlet } from '../../../model/statlet';
import { RemoteRService } from '../../../remote-r.service';
import { PlumbingService } from '../plumbing.service';
import { ParameterType } from './parameter.component';

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
  currentState: NodeState = NodeState.ready;
  @Input() statlet: Statlet;
  @Output() onSelected: EventEmitter<Statlet> = new EventEmitter();

  @HostBinding('id') htmlId: string;
  @HostBinding('style') cssStyle: SafeStyle;

  NodeState = NodeState;  // Make enums available in template
  ParameterType = ParameterType;

  constructor(
    private plumbing: PlumbingService,
    private remoteR: RemoteRService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.htmlId = `node-${this.statlet.id}`;
    this.cssStyle = this.domSanitizer.bypassSecurityTrustStyle(
      `left: ${this.statlet.position.x}px; top: ${this.statlet.position.y}px;`);
  }

  ngAfterViewInit() {
    this.plumbing.makeDraggable(this.htmlId);
  }

  execute(): void {
    this.currentState = NodeState.busy;
    this.remoteR.execute(
      this.statlet.code,
      this.statlet.inputList,
    ).then(outputs => {
      this.updateStatletOutputsWithOpenCpuOutput(outputs);
    }).catch(() => {
    }).then(() => {
      this.currentState = NodeState.ready;
    });
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

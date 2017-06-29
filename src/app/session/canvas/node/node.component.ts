import { AfterViewInit, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

import { RemoteRService } from '../../../remote-r.service';
import { PlumbingService } from '../plumbing.service';
import { Statlet } from '../../../model/statlet';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

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
  @HostBinding('style') cssStyle: SafeStyle;

  constructor(
    private plumbing: PlumbingService,
    private remoteR: RemoteRService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.htmlId = `node-${this.statlet.id}`;
    this.cssStyle = this.domSanitizer.bypassSecurityTrustStyle(`left: ${this.statlet.position.x}px; top: ${this.statlet.position.y}px;`);
  }

  ngAfterViewInit() {
    this.makeDraggable(this.htmlId);
  }

  private makeDraggable(elementId: string): void {
    this.plumbing.makeDraggable(elementId);
  }

  execute(): void {
    this.currentState = NodeState.busy;
    const completeCode = this.getCompleteCode();
    this.remoteR.execute(
      completeCode,
      this.statlet.inputList,
    ).then(outputs => {
      this.updateStatletOutputsWithOpenCpuOutput(outputs);
      this.currentState = NodeState.ready;
    }).catch(() => {
      this.currentState = NodeState.ready;
    })
  }

  private getCompleteCode(): string {
    const functionHeader = `function (${this.statlet.inputList.printParameters()}) {`;
    const functionFooter = `  return(${this.statlet.outputList.printParameters()})\n}`;
    const completedCode = [functionHeader, this.statlet.code, functionFooter].join('\n');
    return completedCode;
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

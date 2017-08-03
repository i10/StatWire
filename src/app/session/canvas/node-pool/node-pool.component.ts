import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Statlet } from 'app/model/statlet';
import { CanvasPosition } from 'app/model/canvas-position';

@Component({
  selector: 'sl-node-pool',
  templateUrl: './node-pool.component.html',
  styleUrls: ['./node-pool.component.sass']
})
export class NodePoolComponent implements OnInit {
  @Input() canvasPosition: CanvasPosition;
  @Output() onClose = new EventEmitter<boolean>();

  @HostBinding('style') cssStyle: SafeStyle;

  private statletNodes: Array<Statlet> = [];

  constructor(
    private domSanitizer: DomSanitizer,
  ) {
    this.statletNodes = this.generateStatletNodes(9);
  }

  ngOnInit() {
    this.cssStyle = this.domSanitizer.bypassSecurityTrustStyle(
        `left: ${this.canvasPosition.x}px; top: ${this.canvasPosition.y}px;`
    );
  }

  private generateStatletNodes(size: number): Array<Statlet> {
    let statletNodes: Array<Statlet> = [];

    for (let i=0; i<size; ++i) {
     statletNodes.push(new Statlet(-1, new CanvasPosition(0, 0), null));
    }

    return statletNodes;
  }

  public close(): void {
    this.onClose.emit(false);
  }

}

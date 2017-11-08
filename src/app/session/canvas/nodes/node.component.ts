import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CanvasPosition } from '../../../model/canvas-position';

import { Node } from '../../../model/node';
import { PlumbingService } from '../plumbing.service';

@Component({
  selector: 'sl-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent implements OnInit, AfterViewInit {
  @Input() node: Node;

  @Output() selected = new EventEmitter();

  @HostBinding('id') htmlId: string;
  @HostBinding('style') cssStyle;  // TODO: add back type hint when bug is fixed: https://github.com/angular/angular/issues/8568

  constructor(
    private plumbing: PlumbingService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.htmlId = `node-${this.node.id}`;
    this.cssStyle = this.domSanitizer.bypassSecurityTrustStyle(
      `left: ${this.node.position.x}px; top: ${this.node.position.y}px;`);
  }

  ngAfterViewInit() {
    this.plumbing.makeDraggable(this.htmlId, (pos) => this.onDragStop(pos));
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown($event: MouseEvent): void {
    const rightMouseButton = 2;
    if ($event.button === rightMouseButton) {
      return;
    } else {
      this.onSelect();
    }
  }

  onDragStop(position: CanvasPosition) {
    this.node.position = position;
  }

  onSelect() {
    this.selected.emit();
  }
}

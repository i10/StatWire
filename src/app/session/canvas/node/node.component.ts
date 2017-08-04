import { AfterViewInit, Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Statlet, StatletState } from '../../../model/statlet';
import { StatletManagerService } from '../../../model/statlet-manager.service';
import { PlumbingService } from '../plumbing.service';
import { ParameterType } from './parameter.component';
import { CanvasPosition } from '../../../model/canvas-position';

@Component({
  selector: 'sl-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent implements OnInit, AfterViewInit {
  StatletState = StatletState;  // expose enums to template
  ParameterType = ParameterType;

  @Input() statlet: Statlet;

  @HostBinding('id') htmlId: string;
  @HostBinding('style') cssStyle: SafeStyle;

  @HostListener('contextmenu', ['$event']) onRightClick($event: MouseEvent): void {
    $event.stopPropagation();
  }
  @HostListener('mousedown', ['$event']) onMouseDown($event: MouseEvent): void {
    const rightMouseButton = 2;
    if ($event.button === rightMouseButton) {
      return;
    } else {
      this.selected();
    }
  }

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.htmlId = `node-${this.statlet.id}`;
    this.cssStyle = this.domSanitizer.bypassSecurityTrustStyle(
      `left: ${this.statlet.position.x}px; top: ${this.statlet.position.y}px;`);
  }

  ngAfterViewInit() {
    this.plumbing.makeDraggable(this.htmlId, (pos) => this.onDragStop(pos));
  }

  onDragStop(position: CanvasPosition) {
    this.statlet.position = position;
  }

  selected(): void {
    this.statletManager.setActiveStatlet(this.statlet.id);
  }
}

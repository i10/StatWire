import { AfterViewInit, Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CanvasPosition } from '../../../../model/canvas-position';

import { Statlet, StatletState } from '../../../../model/statlet';
import { StatletManagerService } from '../../../../model/statlet-manager.service';
import { PlumbingService } from '../../plumbing.service';
import { ParameterType } from '../parameter.component';

@Component({
  selector: 'sl-statlet',
  templateUrl: './statlet.component.html',
  styleUrls: ['./statlet.component.sass'],
})
export class StatletComponent implements OnInit, AfterViewInit {
  StatletState = StatletState;  // expose enums to template
  ParameterType = ParameterType;

  @Input() statlet: Statlet;

  @HostBinding('id') htmlId: string;
  @HostBinding('style') cssStyle;  // TODO: add back type hint when bug is fixed: https://github.com/angular/angular/issues/8568
  createGraphicWidget = function (URL) {
    const canvasPosition: CanvasPosition = new CanvasPosition(this.statlet.position.x + 100, this.statlet.position.y + 100);
    this.statletManager.createGraphicWidget(canvasPosition, URL);
  };
  duplicateStatlet = function () {
    const code = this.statlet.code;
    const canvasPosition: CanvasPosition = new CanvasPosition(this.statlet.position.x + 100, this.statlet.position.y + 100);

    this.statletManager.createStatlet(canvasPosition, code);
  };

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
    private domSanitizer: DomSanitizer,
  ) { }

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
      this.selected();
    }
  }

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

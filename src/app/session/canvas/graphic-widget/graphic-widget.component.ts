import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { GraphicWidget, GraphicWidgetState } from '../../../model/graphic-widget';
import { CanvasPosition } from '../../../model/nodes/canvas-position';
import { StatletManagerService } from '../../../model/statlet-manager.service';
import { PlumbingService } from '../plumbing.service';

@Component({
  selector: 'sl-graphic-widget',
  templateUrl: './graphic-widget.component.html',
  styleUrls: ['./graphic-widget.component.sass']
})
export class GraphicWidgetComponent implements OnInit {

  GraphicWidgetState = GraphicWidgetState;

  @Input() graphicWidget: GraphicWidget;

  @HostBinding('id') htmlId: string;
  @HostBinding('style') cssStyle;  // TODO: add back type hint when bug is fixed: https://github.com/angular/angular/issues/8568

  @HostListener('contextmenu', ['$event']) onRightClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.htmlId = `graphic-widget-${this.graphicWidget.id}`;
    this.cssStyle = this.domSanitizer.bypassSecurityTrustStyle(
      `left: ${this.graphicWidget.position.x}px; top: ${this.graphicWidget.position.y}px;`);
  }

  ngAfterViewInit() {
    this.plumbing.makeDraggable(this.htmlId, (pos) => this.onDragStop(pos));
  }

  onDragStop(position: CanvasPosition) {
    this.graphicWidget.position = position;
  }

  onDelete(): void {
    this.statletManager.deleteGraphicWidget(this.graphicWidget.id);
  }

}

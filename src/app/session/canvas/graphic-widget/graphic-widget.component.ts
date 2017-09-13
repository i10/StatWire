import { AfterViewInit, Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { GraphicWidget, GraphicWidgetState } from '../../../model/graphic-widget';
import { StatletManagerService } from '../../../model/statlet-manager.service';
import { PlumbingService } from '../plumbing.service';
import { CanvasPosition } from '../../../model/canvas-position';

@Component({
  selector: 'sl-graphic-widget',
  templateUrl: './graphic-widget.component.html',
  styleUrls: ['./graphic-widget.component.sass']
})
export class GraphicWidgetComponent implements OnInit {

  GraphicWidgetState = GraphicWidgetState;

  @Input() graphicWidget: GraphicWidget;

  @HostBinding('id') htmlId: string;
  @HostBinding('style') cssStyle: SafeStyle;

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

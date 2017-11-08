import { AfterViewInit, Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { CanvasPosition } from '../../../../model/canvas-position';
import { StatletManagerService } from '../../../../model/statlet-manager.service';
import { ViewerNode } from '../../../../model/viewer-node';
import { PlumbingService } from '../../plumbing.service';
import { ParameterType } from '../statlet/parameter.component';

@Component({
  selector: 'sl-viewer-node',
  templateUrl: './viewer-node.component.html',
  styleUrls: ['./viewer-node.component.sass'],
})
export class ViewerNodeComponent implements OnInit, AfterViewInit {
  ParameterType = ParameterType;

  @Input() viewerNode: ViewerNode;

  @HostBinding('id') htmlId: string;
  @HostBinding('style') cssStyle;  // TODO: add back type hint when bug is fixed: https://github.com/angular/angular/issues/8568

  @HostListener('contextmenu', ['$event'])
  onRightClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.htmlId = `viewer-node-${this.viewerNode.id}`;
    this.cssStyle = this.domSanitizer.bypassSecurityTrustStyle(
      `left: ${this.viewerNode.position.x}px; top: ${this.viewerNode.position.y}px;`);
  }

  ngAfterViewInit() {
    this.plumbing.makeDraggable(this.htmlId, (pos) => this.onDragStop(pos));
  }

  onDragStop(position: CanvasPosition) {
    this.viewerNode.position = position;
  }

  onDelete(): void {
    this.statletManager.deleteViewerNode(this.viewerNode.id);
  }
}

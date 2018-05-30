import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { GraphicsUrl } from '../../../../model/nodes/parameters/outputParameter';
import { ViewerNode } from '../../../../model/nodes/viewer-node';
import { PlumbingService } from '../../plumbing.service';

@Component({
  selector: 'sl-viewer-node',
  templateUrl: './viewer-node.component.html',
  styleUrls: ['./viewer-node.component.sass'],
})
export class ViewerNodeComponent implements OnInit, AfterViewInit {
  endpointHtmlId: string;

  @Input() viewerNode: ViewerNode;

  constructor(
    private plumbing: PlumbingService,
  ) { }

  ngOnInit(): void {
    this.endpointHtmlId = `viewer-input:${this.viewerNode.id}`;
  }

  ngAfterViewInit(): void {
    this.plumbing.makeInput(this.endpointHtmlId);
  }

  isGraphic(): boolean {
    return this.viewerNode.source != null && this.viewerNode.source.isGraphic();
  }

  getRepresentation(): string {
    if (this.viewerNode.source) {
      if (this.viewerNode.source.representation instanceof GraphicsUrl) {
        return this.viewerNode.source.representation.url;
      } else {
        return this.viewerNode.source.representation;
      }
    } else {
      return 'Please choose an input.';
    }
  }
}

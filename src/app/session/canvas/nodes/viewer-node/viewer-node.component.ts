import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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

  getRepresentation(): string {
    if (this.viewerNode.linkedParameter) {
      return this.viewerNode.linkedParameter.representation;
    } else {
      return 'Please choose an input.';
    }
  }
}

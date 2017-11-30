import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { GraphicsUrl, OutputParameter } from '../../../../../model/nodes/parameters/outputParameter';
import { PlumbingService } from '../../../plumbing.service';

@Component({
  selector: 'sl-output',
  templateUrl: './output-parameter.component.html',
  styleUrls: [
    './parameter.component.sass',
    './output-parameter.component.sass',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class OutputParameterComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() output: OutputParameter;
  protected endpointHtmlId: string;

  constructor(
    protected plumbing: PlumbingService,
  ) { }

  ngOnInit(): void {
    this.endpointHtmlId = `output:${this.output.uuid}`;
  }

  ngAfterViewInit(): void {
    this.makeEndpoint(this.endpointHtmlId);
  }

  ngOnDestroy(): void {
    this.removeAllConnections();
  }

  removeAllConnections(): void {
    this.plumbing.removeAllConnectionsFrom(this.endpointHtmlId);
  }

  protected makeEndpoint(id: string) {
    this.plumbing.makeOutput(id);
  }

  getOutputRepresentation(): string {
    if (this.output.representation instanceof GraphicsUrl) {
      return this.output.representation.url;
    } else {
      return this.output.representation;
    }
  }

}

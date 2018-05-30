import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { InputParameter } from '../../../../../model/nodes/parameters/inputParameter';
import { PlumbingService } from '../../../plumbing.service';

@Component({
  selector: 'sl-input',
  templateUrl: './input-parameter.component.html',
  styleUrls: [
    './parameter.component.sass',
    './input-parameter.component.sass',
  ],
})
export class InputParameterComponent implements OnInit, AfterViewInit, OnDestroy {
  endpointHtmlId: string;
  @Input() input: InputParameter;

  constructor(
    protected plumbing: PlumbingService,
  ) { }

  ngOnInit(): void {
    this.endpointHtmlId = `input:${this.input.uuid}`;
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

  fileChanged($event: Event): void {
    const inputElement = $event.target as HTMLInputElement;
    const selectedFile = inputElement.files[0];
    this.input.file = selectedFile;
  }

  useFile(newValue: boolean) {
    this.input.useFile = newValue;
  }

  shouldDisplayManualInput(): boolean {
    return !this.input.isLinked();
  }

  protected makeEndpoint(id: string) {
    this.plumbing.makeInput(id);
  }
}

import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Parameter } from '../../../../model/parameter';
import { PlumbingService } from '../../plumbing.service';

export enum ParameterType {
  Input,
  Output,
}

@Component({
  selector: 'sl-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.sass'],
})
export class ParameterComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() parameterType: ParameterType;
  @Input() parameter: Parameter;

  endpointHtmlId: string;

  ParameterType = ParameterType;

  constructor(
    private plumbing: PlumbingService,
  ) { }

  ngOnInit(): void {
    this.endpointHtmlId = `parameter:${this.parameter.uuid}`;
  }

  ngAfterViewInit(): void {
    this.makeEndpoint(this.endpointHtmlId);
  }

  private makeEndpoint(id: string) {
    switch (this.parameterType) {
      case ParameterType.Input:
        this.plumbing.makeInput(id);
        break;
      case ParameterType.Output:
        this.plumbing.makeOutput(id);
        break;
    }
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
    this.parameter.file = selectedFile;
  }

  useFile(newValue: boolean) {
    this.parameter.useFile = newValue;
  }

  shouldDisplayManualInput(): boolean {
    return !this.parameter.isLinked() && this.parameterType !== ParameterType.Output;
  }
}

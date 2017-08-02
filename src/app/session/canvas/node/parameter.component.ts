import { AfterViewInit, Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';

import { Parameter } from '../../../model/parameter';
import { StatletManagerService } from '../../../model/statlet-manager.service';
import { PlumbingService } from '../plumbing.service';

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
  static callbacksAreSet = false;

  @Input() parameterType: ParameterType;
  @Input() parameter: Parameter;
  htmlId: string;

  ParameterType = ParameterType;

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
  ) { }

  ngOnInit(): void {
    this.htmlId = this.parameter.uuid;
  }

  ngAfterViewInit(): void {
    this.makeEndpoint(this.htmlId);
    if (!ParameterComponent.callbacksAreSet) {
      this.setOnConnectionCallback();
      this.setOnDisconnectCallback();
      ParameterComponent.callbacksAreSet = true;
    }
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

  private setOnConnectionCallback(): void {
    this.plumbing.onConnection((info) => {
      const sourceId = info.sourceId;
      const targetId = info.targetId;
      this.connectParameters(sourceId, targetId);
    });
  }

  private connectParameters(sourceId: string, targetId: string): void {
    const source = this.statletManager.getParameter(sourceId);
    const target = this.statletManager.getParameter(targetId);
    source.linkTo(target);
  }

  private setOnDisconnectCallback(): void {
    this.plumbing.onDisconnect((info) => {
      const sourceId = info.sourceId;
      const targetId = info.targetId;
      this.disconnectParameters(sourceId, targetId);
    });
  }

  private disconnectParameters(sourceId: string, targetId: string): void {
    const source = this.statletManager.getParameter(sourceId);
    const target = this.statletManager.getParameter(targetId);
    source.unlink(target);
  }

  ngOnDestroy(): void {
    this.removeAllConnections();
  }

  removeAllConnections(): void {
    this.plumbing.removeAllConnectionsFrom(this.htmlId);
  }

  showFileInput(): boolean {
    return !this.isLinked() && this.parameter.value === '';
  }

  isLinked(): boolean {
    return this.parameter.linkedParameter !== null;
  }

  fileChanged($event: Event): void {
    const inputElement = $event.target as HTMLInputElement;
    const selectedFile = inputElement.files[0];
    this.parameter.value = selectedFile;
  }
}

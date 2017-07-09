import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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
export class ParameterComponent implements OnInit, AfterViewInit {
  static callbacksAreSet = false;

  @Input() parameterType: ParameterType;
  @Input() parameter: Parameter;
  htmlId: string;

  ParameterType = ParameterType;

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
  ) { }

  ngOnInit() {
    this.htmlId = this.parameter.uuid;
  }

  ngAfterViewInit() {
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

  disconnectParameters(sourceId: string, targetId: string): void {
    const source = this.statletManager.getParameter(sourceId);
    const target = this.statletManager.getParameter(targetId);
    source.unlink(target);
  }
}

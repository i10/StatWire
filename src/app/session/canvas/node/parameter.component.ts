import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Parameter } from '../../../model/parameter';
import { StatletManagerService } from '../../../model/statlet-manager.service';
import { PlumbingService } from '../plumbing.service';

@Component({
  selector: 'sl-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.sass'],
})
export class ParameterComponent implements OnInit, AfterViewInit {
  @Input() parameterType: string;
  @Input() parameter: Parameter;
  @Input() statletId: number;
  @Input() index: number;
  htmlId: string;

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
  ) { }

  ngOnInit() {
    this.htmlId = this.parameter.uuid;
  }

  ngAfterViewInit() {
    this.makeEndpoint(this.htmlId);
    this.setOnConnectionCallback();
    this.setOnDisconnectCallback();
  }

  private makeEndpoint(id: string) {
    switch (this.parameterType) {
      case 'input':
        this.plumbing.makeInput(id);
        break;
      case 'output':
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

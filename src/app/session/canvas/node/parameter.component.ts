import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Parameter } from '../../../model/parameter';
import { StatletManagerService } from '../../../model/statlet-manager.service';
import { PlumbingService } from '../plumbing.service';

@Component({
  selector: 'sl-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.sass']
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
    this.htmlId = `statletId:${this.statletId}-${this.parameterType}-parameterIndex:${this.index}`;
  }

  ngAfterViewInit() {
    this.makeEndpoint(this.htmlId);
    this.setOnConnectionCallback();
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
    })
  }

  connectParameters(sourceId: string, targetId: string): void {
    const sourceIds = this.parseHtmlId(sourceId);
    const targetIds = this.parseHtmlId(targetId);
    this.linkParameters(
      sourceIds.statletId,
      sourceIds.parameterIndex,
      targetIds.statletId,
      targetIds.parameterIndex,
    );
  }

  private linkParameters(
    sourceStatletId: number,
    sourceParameterIndex: number,
    targetStatletId: number,
    targetParameterIndex: number
  ): void {
    const sourceStatlet = this.statletManager.getStatlet(sourceStatletId);
    const sourceParameter = sourceStatlet.outputList.get(sourceParameterIndex);
    const targetStatlet = this.statletManager.getStatlet(targetStatletId);
    const targetParameter = targetStatlet.inputList.get(targetParameterIndex);
    sourceParameter.linkTo(targetParameter);
  }

  private parseHtmlId(htmlId: string): { statletId: number, parameterIndex: number } {
    const regex = /statletId:(\d+)-(?:input|output)-parameterIndex:(\d+)/;
    const matches = regex.exec(htmlId);
    const statletId = parseInt(matches[1], 10);
    const parameterIndex = parseInt(matches[2], 10);
    return {statletId: statletId, parameterIndex: parameterIndex};
  }

}

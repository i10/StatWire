import { Component } from '@angular/core';

import { isNullOrUndefined } from 'util';

import { ParameterList } from '../../model/parameter-list';
import { Statlet, StatletState } from '../../model/statlet';
import { StatletManagerService } from '../../model/statlet-manager.service';

@Component({
  selector: 'sl-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass'],
})
export class EditorComponent {
  aceMode = 'r';
  aceOptions = {
    onLoaded: editor => {
      editor.$blockScrolling = Infinity;
    },
  };

  StatletState = StatletState;  // expose enum to template

  private functionHeaderPattern = /function\(([^)]*?)\)/;
  private returnStatementPattern = /return\(([^)]*?)\)/;

  constructor(
    private statletManager: StatletManagerService,
  ) { }

  get statlet(): Statlet {
    return this.statletManager.activeStatlet;
  }

  isStatletPresent(): boolean {
    return !isNullOrUndefined(this.statlet);
  }

  synchronizeStatlet(): void {
    const updatedInputList = this.getInputList(this.statlet.code);
    this.statlet.inputList.updateWith(updatedInputList);
    const updatedOutputList = this.getOutputList(this.statlet.code);
    this.statlet.outputList.updateWith(updatedOutputList);
  }

  private getInputList(code: string): ParameterList {
    const inputNames = this.parseParameters(code, this.functionHeaderPattern);
    return this.makeParameterList(inputNames);
  }

  private getOutputList(code: string): ParameterList {
    const outputNames = this.parseParameters(code, this.returnStatementPattern);
    return this.makeParameterList(outputNames);
  }

  private parseParameters(code: string, pattern: RegExp): string[] {
    const match = pattern.exec(code);
    if (!match) {
      console.error('No match was found');
      return [];
    }
    const allParameters = match[1];
    if (allParameters === '') {
      return [];
    }
    const parameterList = allParameters.split(/\s*,\s*/);
    return parameterList;
  }

  private makeParameterList(parameterNames: string[]) {
    const updatedParameterList = new ParameterList();
    for (const parameter of parameterNames) {
      updatedParameterList.addParameter(parameter);
    }
    return updatedParameterList;
  }
}

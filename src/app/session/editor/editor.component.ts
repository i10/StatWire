import { Component, Input } from '@angular/core';

import { Statlet, StatletState } from '../../model/statlet';
import { ParameterList } from '../../model/parameter-list';

@Component({
  selector: 'sl-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass'],
})
export class EditorComponent {
  @Input() statlet: Statlet;
  aceMode = 'r';
  aceOptions = {
    onLoaded: editor => {
      editor.$blockScrolling = Infinity;
    },
  };

  StatletState = StatletState;

  private functionHeaderPattern = /function\(([^)]*?)\)/;
  private returnStatementPattern = /return\(([^)]*?)\)/;

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

import { Component } from '@angular/core';

import { isNullOrUndefined } from 'util';

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

  constructor(
    private statletManager: StatletManagerService,
  ) { }

  get statlet(): Statlet {
    return this.statletManager.activeStatlet;
  }

  isStatletPresent(): boolean {
    return !isNullOrUndefined(this.statlet);
  }

}

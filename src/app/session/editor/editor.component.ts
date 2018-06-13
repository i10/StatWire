import { AfterViewInit, Component, ViewChild } from '@angular/core';

import 'brace/mode/r';
import 'brace/theme/chrome';
import 'brace/ext/language_tools';
import { acequire } from 'brace';
import { isNullOrUndefined } from 'util';

import { Statlet, StatletState } from '../../model/nodes/statlet';
import { StatletManagerService } from '../../model/statlet-manager.service';

@Component({
  selector: 'sl-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass'],
})
export class EditorComponent implements AfterViewInit {
  StatletState = StatletState;  // expose enum to template

  constructor(
    private statletManager: StatletManagerService,
  ) { }

  ngAfterViewInit(): void {
    const statletManager = this.statletManager;

    const langTools = acequire('ace/ext/language_tools');

    const rCompleter = {
      getCompletions: async function(editor, session, pos, prefix, callback) {
        if (prefix.length === 0) {
          callback(null, []);
          return;
        }

        const result = await statletManager.activeStatlet.autocomplete(prefix);

        callback(null, result);
      }
    };

    langTools.addCompleter(rCompleter);
  }

  get statlet(): Statlet {
    return this.statletManager.activeStatlet;
  }

  isStatletPresent(): boolean {
    return !isNullOrUndefined(this.statlet);
  }

  onDelete(): void {
    this.statletManager.deleteStatlet(this.statlet.id);
  }
}

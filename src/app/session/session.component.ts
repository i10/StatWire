import { Component, OnInit } from '@angular/core';

import { StatletManagerService } from '../model/statlet-manager.service';
import { SessionStorageService } from './sessionStorage.service';

@Component({
  selector: 'sl-session',
  host: {'(window:keydown)': 'onKeyPress($event)'},
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.sass'],
  providers: [StatletManagerService],
})

export class SessionComponent implements OnInit {
  constructor(
    private sessionStorage: SessionStorageService,
    private statletManager: StatletManagerService
  ) {
    sessionStorage.subscribeTo(statletManager.onChange);
  }

  ngOnInit() {
    if (this.sessionStorage.pop() != null) {
      this.statletManager.overrideAllStatlets(this.sessionStorage.pop());
    }
  }

  onKeyPress($event: KeyboardEvent): void {
    switch ($event.key) {
      case 'Delete':
        if ($event.ctrlKey) {
          this.statletManager.deleteEverything();
        }
        break;
    }
  }
}

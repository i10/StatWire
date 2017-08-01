import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../sessionStorage.service';

import { StatletManagerService } from '../model/statlet-manager.service';

@Component({
  selector: 'sl-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.sass'],
  providers: [StatletManagerService],
})

export class SessionComponent implements OnInit {
  constructor(
    private sessionStorage: SessionStorageService,
    private statletManager: StatletManagerService
  ) { }

}

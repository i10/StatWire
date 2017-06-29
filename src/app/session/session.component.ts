import { Component, OnInit } from '@angular/core';
import { Statlet } from '../model/statlet';
import { StatletManagerService } from '../model/statlet-manager.service';

@Component({
  selector: 'sl-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.sass'],
})
export class SessionComponent implements OnInit {
  allStatlets: Statlet[];
  activeStatlet: Statlet;

  constructor(
    private statletManager: StatletManagerService,
  ) { }

  ngOnInit() {
    this.allStatlets = this.statletManager.getAllStatlets();
    this.activeStatlet = this.allStatlets[0];
  }

}

import { Component, OnInit } from '@angular/core';
import { Statlet } from '../model/statlet';
import { StatletManagerService } from '../model/statlet-manager.service';

@Component({
  selector: 'sl-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.sass'],
})
export class SessionComponent implements OnInit {
  activeStatlet: Statlet;

  constructor(
    private statletManager: StatletManagerService,
  ) { }

  ngOnInit() {
    this.activeStatlet = this.statletManager.getAllStatlets()[0];
  }

}

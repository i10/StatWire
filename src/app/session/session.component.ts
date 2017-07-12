import { Component } from '@angular/core';

import { StatletManagerService } from '../model/statlet-manager.service';

@Component({
  selector: 'sl-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.sass'],
  providers: [StatletManagerService],
})
export class SessionComponent {
}

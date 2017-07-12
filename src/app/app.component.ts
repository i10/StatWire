import { Component } from '@angular/core';

import { RemoteRService } from './remote-r.service';

@Component({
  selector: 'sl-root',
  templateUrl: './app.component.html',
  providers: [RemoteRService],
})
export class AppComponent { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StatletManagerService } from './model/statlet-manager.service';
import { SessionComponent } from './session/session.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [StatletManagerService],
  bootstrap: [AppComponent],
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StatletManagerService } from './model/statlet-manager.service';
import { EditorComponent } from './session/editor/editor.component';
import { SessionComponent } from './session/session.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionComponent,
    EditorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [StatletManagerService],
  bootstrap: [AppComponent],
})
export class AppModule { }

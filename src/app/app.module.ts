import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { LAceEditorModule } from 'angular2-ace';

import { AppComponent } from './app.component';
import { StatletManagerService } from './model/statlet-manager.service';
import { CanvasComponent } from './session/canvas/canvas.component';
import { EditorComponent } from './session/editor/editor.component';
import { SessionComponent } from './session/session.component';
import { NodeComponent } from './session/canvas/node/node.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionComponent,
    EditorComponent,
    CanvasComponent,
    NodeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    LAceEditorModule,
  ],
  providers: [StatletManagerService],
  bootstrap: [AppComponent],
})
export class AppModule { }

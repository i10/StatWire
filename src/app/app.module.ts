import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AceEditorModule } from 'ng2-ace-editor';

import { AppComponent } from './app.component';
import { StatletManagerService } from './model/statlet-manager.service';
import { RemoteRService } from './remote-r.service';
import { CanvasComponent } from './session/canvas/canvas.component';
import { NodeComponent } from './session/canvas/node/node.component';
import { ParameterComponent } from './session/canvas/node/parameter.component';
import { EditorComponent } from './session/editor/editor.component';
import { SessionComponent } from './session/session.component';
import { UuidService } from './uuid.service';
import { NodePoolComponent } from './session/canvas/node-pool/node-pool.component';
import { StatletNodeComponent } from './session/canvas/node-pool/statlet-node/statlet-node.component';
import { SessionStorageService } from './sessionStorage.service';
import { WidgetPoolComponent } from './session/canvas/widget-pool/widget-pool.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionComponent,
    EditorComponent,
    CanvasComponent,
    NodeComponent,
    ParameterComponent,
    NodePoolComponent,
    StatletNodeComponent,
    WidgetPoolComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AceEditorModule,
    HttpModule,
  ],
  providers: [
    StatletManagerService,
    UuidService,
    RemoteRService,
    SessionStorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

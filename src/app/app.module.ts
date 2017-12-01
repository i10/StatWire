import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AceEditorModule } from 'ng2-ace-editor';

import { AppComponent } from './app.component';
import { StatletManagerService } from './model/statlet-manager.service';
import { RemoteRService } from './remote-r.service';
import { CanvasComponent } from './session/canvas/canvas.component';
import { NodePoolComponent } from './session/canvas/node-pool/node-pool.component';
import { StatletNodeComponent } from './session/canvas/node-pool/statlet-node/statlet-node.component';
import { NodeComponent } from './session/canvas/nodes/node.component';
import { InputParameterComponent } from './session/canvas/nodes/statlet/parameter/input-parameter.component';
import { OutputParameterComponent } from './session/canvas/nodes/statlet/parameter/output-parameter.component';
import { StatletComponent } from './session/canvas/nodes/statlet/statlet.component';
import { ViewerNodeComponent } from './session/canvas/nodes/viewer-node/viewer-node.component';
import { EditorComponent } from './session/editor/editor.component';
import { SessionComponent } from './session/session.component';
import { SessionStorageService } from './session/sessionStorage.service';
import { UuidService } from './uuid.service';

@NgModule({
  declarations: [
    AppComponent,
    SessionComponent,
    EditorComponent,
    CanvasComponent,
    NodeComponent,
    NodePoolComponent,
    StatletNodeComponent,
    ViewerNodeComponent,
    StatletComponent,
    InputParameterComponent,
    OutputParameterComponent,
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
export class AppModule {}

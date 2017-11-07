import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AceEditorModule } from 'ng2-ace-editor';

import { AppComponent } from './app.component';
import { StatletManagerService } from './model/statlet-manager.service';
import { RemoteRService } from './remote-r.service';
import { CanvasComponent } from './session/canvas/canvas.component';
import { GraphicWidgetComponent } from './session/canvas/graphic-widget/graphic-widget.component';
import { NodePoolComponent } from './session/canvas/node-pool/node-pool.component';
import { StatletNodeComponent } from './session/canvas/node-pool/statlet-node/statlet-node.component';
import { NodeComponent } from './session/canvas/nodes/node.component';
import { ParameterComponent } from './session/canvas/nodes/parameter.component';
import { ViewerNodeComponent } from './session/canvas/viewer-node/viewer-node.component';
import { EditorComponent } from './session/editor/editor.component';
import { SessionComponent } from './session/session.component';
import { SessionStorageService } from './sessionStorage.service';
import { UuidService } from './uuid.service';

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
    ViewerNodeComponent,
    GraphicWidgetComponent,
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

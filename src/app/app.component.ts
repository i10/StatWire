import { Component, OnInit } from '@angular/core';
import { StatletManagerService } from './model/statlet-manager.service';
import { CanvasPosition } from 'app/model/canvas-position';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private statletManager: StatletManagerService,
  ) { }

  ngOnInit(): void {
    this.addDummyStatlets();
  }

  private addDummyStatlets(): void {
    const statlet1 = this.statletManager.createStatlet(
      'loadVariable',
      new CanvasPosition(10, 10),
    );
    statlet1.outputList.addParameter('loaded');

    const statlet2 = this.statletManager.createStatlet(
      'increment',
      new CanvasPosition(10, 100),
    );
    statlet2.inputList.addParameter('toIncrement');
    statlet2.outputList.addParameter('incremented');
  }
}

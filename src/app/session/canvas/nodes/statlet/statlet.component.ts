import { Component, Input } from '@angular/core';

import { CanvasPosition } from '../../../../model/canvas-position';
import { Statlet } from '../../../../model/statlet';
import { StatletManagerService } from '../../../../model/statlet-manager.service';
import { ParameterType } from '../parameter.component';

@Component({
  selector: 'sl-statlet',
  templateUrl: './statlet.component.html',
  styleUrls: ['./statlet.component.sass'],
})
export class StatletComponent {
  ParameterType = ParameterType;

  @Input() statlet: Statlet;

  constructor(
    private statletManager: StatletManagerService,
  ) { }

  createGraphicWidget = function (URL) {
    const canvasPosition: CanvasPosition = new CanvasPosition(this.statlet.position.x + 100, this.statlet.position.y + 100);
    this.statletManager.createGraphicWidget(canvasPosition, URL);
  };

  selected(): void {
    this.statletManager.setActiveStatlet(this.statlet.id);
  }
}

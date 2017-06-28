import { Component, Input, OnInit } from '@angular/core';
import { PlumbingService } from '../plumbing.service';
import { StatletManagerService } from '../../../model/statlet-manager.service';
import { Parameter } from '../../../model/parameter';

@Component({
  selector: 'sl-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.sass']
})
export class ParameterComponent implements OnInit {
  @Input() parameterType: string;
  @Input() parameter: Parameter;
  @Input() statletId: number;
  @Input() index: number;

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
  ) { }

  ngOnInit() {
  }

}

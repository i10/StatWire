import { AfterViewInit, Component, HostBinding, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { StatletState } from '../../../model/statlet';
import { StatletGroup } from '../../../model/statletGroup';
import { PlumbingService } from '../plumbing.service';

@Component({
  selector: 'sl-group',
  templateUrl: './statletgroup.component.html',
  styleUrls: ['./statletgroup.component.sass']
})
export class StatletGroupComponent implements OnInit, AfterViewInit {
  StatletState = StatletState;  // expose enums to template

  @Input() statletGroup: StatletGroup;
  currentState = StatletState.ready;

  @HostBinding('id') htmlId: string;
  @HostBinding('style') cssStyle: SafeStyle;

  constructor(
    private plumbing: PlumbingService,
    private domSanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.htmlId = `group-${this.statletGroup.id}`;
    this.cssStyle = this.domSanitizer.bypassSecurityTrustStyle(
      `left: ${this.statletGroup.position.x}px; top: ${this.statletGroup.position.y}px;`);
  }

  ngAfterViewInit() {
    this.plumbing.makeDraggable(this.htmlId);
  }

  onExecute(): void { }
}

import { AfterViewInit, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Statlet, StatletState } from '../../../model/statlet';
import { PlumbingService } from '../plumbing.service';
import { ParameterType } from './parameter.component';

@Component({
  selector: 'sl-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent implements OnInit, AfterViewInit {
  @Input() statlet: Statlet;
  @Output() onSelected: EventEmitter<Statlet> = new EventEmitter();

  @HostBinding('id') htmlId: string;
  @HostBinding('style') cssStyle: SafeStyle;

  StatletState = StatletState;  // expose enums to template
  ParameterType = ParameterType;

  constructor(
    private plumbing: PlumbingService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.htmlId = `node-${this.statlet.id}`;
    this.cssStyle = this.domSanitizer.bypassSecurityTrustStyle(
      `left: ${this.statlet.position.x}px; top: ${this.statlet.position.y}px;`);
  }

  ngAfterViewInit() {
    this.plumbing.makeDraggable(this.htmlId);
  }

  selected(): void {
    this.onSelected.emit(this.statlet);
  }
}

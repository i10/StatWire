import {
  AfterViewInit, Component, EventEmitter, HostBinding, HostListener, Input, OnInit,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Statlet, StatletState } from '../../../model/statlet';
import { PlumbingService } from '../plumbing.service';
import { ParameterType } from './parameter.component';
import { StatletManagerService } from '../../../model/statlet-manager.service';

@Component({
  selector: 'sl-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent implements OnInit, AfterViewInit {
  StatletState = StatletState;  // expose enums to template
  ParameterType = ParameterType;

  @Input() statlet: Statlet;
  @Output() onSelected: EventEmitter<Statlet> = new EventEmitter();

  @HostBinding('id') htmlId: string;
  @HostBinding('style') cssStyle: SafeStyle;

  @HostListener('contextmenu', ['$event']) onRightClick($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.statletManager.deleteStatlet(this.statlet.id);
  }

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
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

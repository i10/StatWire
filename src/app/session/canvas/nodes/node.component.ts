import { Component, Input } from '@angular/core';

import { Node } from '../../../model/node';

@Component({
  selector: 'sl-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent {
  @Input() node: Node;

  constructor() { }
}

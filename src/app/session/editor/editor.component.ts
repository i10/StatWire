import { Component, Input } from '@angular/core';

import { Statlet } from '../../model/statlet';

@Component({
  selector: 'sl-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent {
  @Input() statlet: Statlet;

  onAceLoaded(editor): void {
    editor.$blockScrolling = Infinity;
  }

}

import { Component, Input } from '@angular/core';

import { Statlet } from '../../model/statlet';

@Component({
  selector: 'sl-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent {
  @Input() statlet: Statlet;
  aceMode = 'r';
  aceOptions = {
    onLoaded: editor => {
      editor.$blockScrolling = Infinity;
    }
  };
}

import { NodeWidget } from './nodeWidget';
import { OutputParameter } from './parameters/outputParameter';

export class ViewerNode extends NodeWidget {
  linkedParameter: OutputParameter;
}

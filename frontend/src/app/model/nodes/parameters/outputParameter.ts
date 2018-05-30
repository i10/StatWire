import { Parameter } from './parameter';

export class OutputParameter extends Parameter {
  representation: string | GraphicsUrl = '';

  static fromUrl(name, url) {
    const parameter = new OutputParameter(name);
    parameter.representation = new GraphicsUrl(url);
    return parameter;
  }

  isGraphic(): boolean {
    return this.representation instanceof GraphicsUrl;
  }
}

export class GraphicsUrl {
  constructor(
    public url: string,
  ) {}
}

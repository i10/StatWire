import { by, ElementFinder } from 'protractor';

export function convertElementToSlNode(element: ElementFinder): SlNode {
  element.input = function (place: number): SlParameter {
    const inputElement = this.all(by.css('.parameter-input')).get(place - 1);
    return convertElementToSlParameter(inputElement);
  };

  element.output = function (place: number): SlParameter {
    const outputElement = this.all(by.css('.parameter-output')).get(place - 1);
    return convertElementToSlParameter(outputElement);
  };

  element.executeButton = function (): ElementFinder {
    return this.element(by.css('.node-execute'));
  };

  return element as SlNode;
}

export function convertElementToSlParameter(element: ElementFinder): SlParameter {
  element.endpoint = function (): ElementFinder {
    return this.element(by.css('.parameter-endpoint'));
  };

  return element as SlParameter;
}

export interface SlNode extends ElementFinder {
  input(place: number): SlParameter;
  output(place: number): SlParameter;
  executeButton(): ElementFinder;
}

export interface SlParameter extends ElementFinder {
  endpoint(): ElementFinder;
}


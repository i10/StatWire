import { by, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

export interface SlNode extends ElementFinder {
  getTitle(): promise.Promise<string>;
  input(place: number): SlParameter;
  output(place: number): SlParameter;
  clickExecuteButton(): void;
}

export function convertElementToSlNode(element: ElementFinder): SlNode {
  element.getTitle = function (): promise.Promise<string> {
    return this.element(by.css('.node-title')).getText();
  };

  element.input = function (place: number): SlParameter {
    const inputElement = this.all(by.css('.parameter-input')).get(place - 1);
    return convertElementToSlParameter(inputElement);
  };

  element.output = function (place: number): SlParameter {
    const outputElement = this.all(by.css('.parameter-output')).get(place - 1);
    return convertElementToSlParameter(outputElement);
  };

  element.clickExecuteButton = function (): void {
    return this.element(by.css('.node-execute')).click();
  };

  return element as SlNode;
}

export interface SlParameter extends ElementFinder {
  getName(): promise.Promise<string>;
  getEndpoint(): ElementFinder;
}

export function convertElementToSlParameter(element: ElementFinder): SlParameter {
  element.getName = function (): promise.Promise<string> {
    return element.getText();
  };

  element.getEndpoint = function (): ElementFinder {
    return this.element(by.css('.parameter-endpoint'));
  };

  return element as SlParameter;
}

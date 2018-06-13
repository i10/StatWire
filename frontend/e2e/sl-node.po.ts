import { browser, by, ElementFinder, ExpectedConditions } from 'protractor';
import { promise } from 'selenium-webdriver';

export interface SlNode extends ElementFinder {
  getTitle(): promise.Promise<string>;
  input(place: number): SlParameter;
  output(place: number): SlParameter;
  clickExecuteButton(): void;
  waitWhileBusy(): ElementFinder;
  enterFilePath(absolutePath: string): void;
  getGraphicSelection(): ElementFinder;
}

export function convertElementToSlNode(element: ElementFinder): SlNode {
  element.getTitle = function (): promise.Promise<string> {
    return this.element(by.css('.node-title')).getText();
  };

  element.input = function (place: number): SlParameter {
    const inputElement = this.all(by.css('.input-parameter')).get(place - 1);
    return convertElementToSlParameter(inputElement);
  };

  element.output = function (place: number): SlParameter {
    const outputElement = this.all(by.css('.output-parameter')).get(place - 1);
    return convertElementToSlParameter(outputElement);
  };

  element.clickExecuteButton = function (): void {
    return this.element(by.css('.node-execute')).click();
  };

  element.waitWhileBusy = function (): void {
    const readyIndicator = this.element(by.css('.fa-play'));
    browser.wait(ExpectedConditions.presenceOf(readyIndicator), 5000);
  };

  element.enterFilePath = function (absolutePath: string): void {
    const fileInput = this.element(by.css('input[type="file"]'));
    fileInput.sendKeys(absolutePath);
  };

  element.getGraphicSelection = function (): ElementFinder {
    return this.element(by.css('.node-plots'));
  };

  return element as SlNode;
}

export interface SlParameter extends ElementFinder {
  getName(): promise.Promise<string>;
  getEndpoint(): ElementFinder;
  getInput(): ElementFinder;
  switchToFileInput(): void;
}

export function convertElementToSlParameter(element: ElementFinder): SlParameter {
  element.getName = function (): promise.Promise<string> {
    return element.getText();
  };

  element.getEndpoint = function (): ElementFinder {
    return this.element(by.css('.parameter-endpoint'));
  };

  element.getInput = function (): ElementFinder {
    return this.element(by.css('.parameter-value-input'))
  };

  element.switchToFileInput = function (): void {
    this.element(by.css('.parameter-button-input-file')).click();
  };

  return element as SlParameter;
}

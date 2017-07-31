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

  element.waitWhileBusy = function (): void {
    const readyIndicator = this.element(by.css('.node-ready'));
    browser.wait(ExpectedConditions.presenceOf(readyIndicator), 5000);
  };

  element.enterFilePath = function (absolutePath: string): void {
    const fileInput = this.element(by.css('input[type="file"]'));
    fileInput.sendKeys(absolutePath);
  };

  element.getGraphicSelection = function (): ElementFinder {
    return this.element(by.css('.graphics'));
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

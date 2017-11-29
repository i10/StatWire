import { browser, by, element, ElementFinder, protractor } from 'protractor';
import { promise } from 'selenium-webdriver';

import { convertElementToSlNode, SlNode } from './sl-node.po';

export class StatLetsPage {
  editor = new SlEditor();

  nextId = 1;

  navigateTo() {
    return browser.get('/');
  }

  addNodeAt(x: number, y: number): SlNode {
    const canvas = element(by.tagName('sl-canvas'));
    browser.actions()
      .mouseMove(canvas, {x: x, y: y})
      .click(protractor.Button.RIGHT)
      .mouseMove({x: 10, y: 10})
      .click()
      .perform();

    const id = this.nextId;
    this.nextId++;
    const addedNodeElement = element(by.id(`node-${id}`));
    return convertElementToSlNode(addedNodeElement);
  }

  getNumberOfConnectionEndpoints(): promise.Promise<number> {
    return element.all(by.css('.jtk-endpoint')).count();
  }
}

export class SlEditor {
  private editor = element(by.tagName('sl-editor'));
  private editorTitle = this.editor.element(by.css('.editor-title'));

  getTitle(): promise.Promise<string> {
    return this.editorTitle.getAttribute('value');
  }

  replaceTitle(newTitle: string): void {
    this.clear(this.editorTitle);
    this.editorTitle.sendKeys(newTitle);
  }

  clear(inputElement: ElementFinder): void {
    inputElement.sendKeys(
      protractor.Key.CONTROL, 'a',
      protractor.Key.BACK_SPACE,
    );
  }

  replaceCode(newCode: string): void {
    const editorInput = this.editor.element(by.css('.ace_text-input'));
    this.clear(editorInput);
    editorInput.sendKeys(newCode);
  }

  clickDeleteButton(): void {
    this.editor.element(by.css('.editor-button-delete')).click();
  }
}

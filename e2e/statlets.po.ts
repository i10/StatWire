import { browser, by, element, ElementFinder, protractor } from 'protractor';

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
      .perform();

    const id = this.nextId;
    this.nextId++;
    const addedNodeElement = element(by.id(`node-${id}`));
    return convertElementToSlNode(addedNodeElement);
  }
}

export class SlEditor {
  private editor = element(by.tagName('sl-editor'));

  replaceTitle(newTitle: string): void {
    const editorTitle = this.editor.element(by.css('.editor-title'));
    this.clear(editorTitle);
    editorTitle.sendKeys(newTitle);
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

  syncButton(): ElementFinder {
    return element(by.css('.editor-button-sync'));
  }
}

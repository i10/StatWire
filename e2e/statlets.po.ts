import { browser, by, element, ElementFinder, protractor } from 'protractor';

export class StatLetsPage {
  private editor = element(by.tagName('sl-editor'));
  private editorInput = this.editor.element(by.css('.ace_text-input'));
  private editorOutput = this.editor.element(by.css('.ace_content'));

  navigateTo() {
    return browser.get('/');
  }

  getNode(id: number) {
    return element(by.id(`node-${id}`));
  }

  getInputsOf(node: ElementFinder) {
    return node.element(by.css('.node-inputs'))
      .all(by.css('.parameter-input'));
  }

  getOutputsOf(node: ElementFinder) {
    return node.element(by.css('.node-outputs'))
      .all(by.css('.parameter-output'));
  }

  getEndpointOf(parameter: ElementFinder) {
    return parameter.element(by.css('.parameter-endpoint'));
  }

  readTitleOf(node: ElementFinder) {
    return node.element(by.css('.node-title')).getText();
  }

  getOutputEndpointOfNode1() {
    return this.getEndpointOf(this.getOutputsOf(this.getNode(1)).get(0));
  }

  getInputEndpointOfNode2() {
    return this.getEndpointOf(this.getInputsOf(this.getNode(2)).get(0));
  }

  getAllEndpoints() {
    return element.all(by.css('.jtk-endpoint'));
  }

  readEditorTitle() {
    return this.editor.element(by.css('.editor-title')).getText();
  }

  clearEditor() {
    const selectAll = protractor.Key.chord(protractor.Key.CONTROL, 'a');
    this.editorInput.sendKeys(
      selectAll, protractor.Key.BACK_SPACE,
    );
  }

  inputIntoEditor(code: string) {
    this.editorInput.sendKeys(
      code,
    );
  }

  readEditor() {
    return this.editorOutput.getText();
  }
}

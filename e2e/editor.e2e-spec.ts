import { StatLetsPage } from './statlets.po';
import { browser } from 'protractor';

describe('Editor', () => {
  let page: StatLetsPage;

  beforeEach(() => {
    page = new StatLetsPage();
    page.navigateTo();
  });

  it('should display the title of the selected statlet', function () {
    const node1 = page.getNode(1);
    const node1Title = page.readTitleOf(node1);
    node1.click();
    expect(page.readEditorTitle()).toEqual(node1Title);

    const node2 = page.getNode(2);
    const node2Title = page.readTitleOf(node2);
    node2.click();
    expect(page.readEditorTitle()).toEqual(node2Title);
  });

  it('should display entered code', function () {
    const testCode = 'Display me!';
    page.clearEditor();
    page.inputIntoEditor(testCode);
    expect(page.readEditor()).toEqual(testCode);
  });

  it('should display the code of the selected node', function () {
    const node1 = page.getNode(1);
    node1.click();
    const node1Code = "This is node2's code.";
    page.clearEditor();
    page.inputIntoEditor(node1Code);
    expect(page.readEditor()).toEqual(node1Code);

    const node2 = page.getNode(2);
    node2.click();
    const node2Code = "This is node1's code.";
    page.clearEditor();
    page.inputIntoEditor(node2Code);
    expect(page.readEditor()).toEqual(node2Code);

    node1.click();
    expect(page.readEditor()).toEqual(node1Code);

    node2.click();
    expect(page.readEditor()).toEqual(node2Code);
  });
});

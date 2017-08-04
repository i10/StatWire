import * as path from 'path';
import { browser, by, ExpectedConditions } from 'protractor';

import { StatLetsPage } from './statlets.po';

describe('StatLets', () => {
  let page: StatLetsPage;

  beforeEach(() => {
    page = new StatLetsPage();
    page.navigateTo();
  });

  beforeEach(() => {
    browser.waitForAngularEnabled(false);  // Ace blocks Angular
  });

  afterEach(() => {
    browser.executeScript('sessionStorage.clear();');
  });

  it('should allow the execution of a two-node analysis', () => {
    // Frank wants to do a quick mock analysis, to get an impression of StatLets.
    // Fist, he adds two nodes to the canvas.
    const node1 = page.addNodeAt(10, 10);
    expect(page.editor.getTitle()).toEqual(node1.getTitle());
    expect(node1.getAttribute('id')).toEqual('node-1');
    const node2 = page.addNodeAt(10, 100);
    expect(page.editor.getTitle()).toEqual(node2.getTitle());
    expect(node2.getAttribute('id')).toEqual('node-2');

    // He then edits the code of the first node to be a (very) simple function.
    node1.click();
    expect(page.editor.getTitle()).toEqual(node1.getTitle());
    page.editor.replaceTitle('generatePrime');
    expect(node1.getTitle()).toEqual(page.editor.getTitle());
    page.editor.replaceCode(
      `function() {
  prime <- 11
  return(prime)
}`,
    );
    page.editor.clickSyncButton();
    // To update node on the canvas, he syncs it.
    expect(node1.output(1).getName()).toContain('prime');

    // He edits the code of the second node, now even using an input parameter to his function!
    node2.click();
    expect(page.editor.getTitle()).toEqual(node2.getTitle());
    page.editor.replaceTitle('double');
    expect(node2.getTitle()).toEqual(page.editor.getTitle());
    page.editor.replaceCode(
      `function(number) {
  double <- number * 2;
  return(double)
}`,
    );
    // Again, he syncs the node to make the parameters show up on the canvas.
    page.editor.clickSyncButton();
    expect(node2.input(1).getName()).toContain('number');
    expect(node2.output(1).getName()).toContain('double');

    // Frank connects the output of the first node to the input of the second one.
    browser.actions()
      .dragAndDrop(node1.output(1).getEndpoint(), node2.input(1).getEndpoint())
      .perform();

    // He executes each node and observes that a value gets displayed when the node finishes execution.
    node1.clickExecuteButton();
    node1.waitWhileBusy();
    expect(node1.output(1).getName()).toContain('11');
    expect(node2.input(1).getName()).toContain('11');
    node2.clickExecuteButton();
    node2.waitWhileBusy();
    expect(node2.output(1).getName()).toContain('22');

    // Frank is very impressed with StatLets. But he is mean and will try to break it. To be continued...
  });

  it('should allow nodes to be deleted', () => {
    // Frank decides to do a spontaneous analysis, but he suspects he might remove a step later on.
    // He first adds three nodes.
    const node1 = page.addNodeAt(10, 10);
    const node2 = page.addNodeAt(300, 10);
    const node3 = page.addNodeAt(600, 10);

    // He edits the first node.
    node1.click();
    expect(page.editor.getTitle()).toEqual(node1.getTitle());
    page.editor.replaceTitle('readData');
    expect(node1.getTitle()).toEqual(page.editor.getTitle());
    page.editor.replaceCode(
      `function() {
  persons <- c('Me', 'He', 'She', 'It')
  expenses <- c(100, 200, 150, 300)
  return(persons, expenses)
}`,
    );
    page.editor.clickSyncButton();
    expect(node1.output(1).getName()).toContain('persons');
    expect(node1.output(2).getName()).toContain('expenses');

    // He edits the second node.
    node2.click();
    expect(page.editor.getTitle()).toEqual(node2.getTitle());
    page.editor.replaceTitle('convertCurrency');
    expect(node2.getTitle()).toEqual(page.editor.getTitle());
    page.editor.replaceCode(
      `function(euro) {
  dollar <- euro * 100
  return(dollar)
}`,
    );
    page.editor.clickSyncButton();
    expect(node2.input(1).getName()).toContain('euro');
    expect(node2.output(1).getName()).toContain('dollar');

    // He edits the third node.
    node3.click();
    expect(page.editor.getTitle()).toEqual(node3.getTitle());
    page.editor.replaceTitle('average');
    expect(node3.getTitle()).toEqual(page.editor.getTitle());
    page.editor.replaceCode(
      `function(levels, values) {
  average <- sum(values) / length(levels)
  return(average)
}`,
    );
    page.editor.clickSyncButton();
    expect(node3.input(1).getName()).toContain('levels');
    expect(node3.input(2).getName()).toContain('values');
    expect(node3.output(1).getName()).toContain('average');

    // He links all the nodes together.
    browser.actions()
      .dragAndDrop(node1.output(1).getEndpoint(), node3.input(1).getEndpoint())
      .dragAndDrop(node1.output(2).getEndpoint(), node2.input(1).getEndpoint())
      .dragAndDrop(node2.output(1).getEndpoint(), node3.input(2).getEndpoint())
      .perform();

    // He executes the nodes and watches the parameters.
    node1.clickExecuteButton();
    node1.waitWhileBusy();
    expect(node1.output(1).getName()).toContain('Me,He,She,It');
    expect(node1.output(2).getName()).toContain('100,200,150,300');
    node2.clickExecuteButton();
    node2.waitWhileBusy();
    expect(node2.output(1).getName()).toContain('10000,20000,15000,30000');
    node3.clickExecuteButton();
    node3.waitWhileBusy();
    expect(node3.output(1).getName()).toContain((10000 + 20000 + 15000 + 30000) / 4);

    // Frank now decides, that he does not want the transformation anymore and removes it. All its connections are automatically deleted.
    expect(page.getNumberOfConnectionEndpoints()).toEqual(6);
    node2.click();
    page.editor.clickDeleteButton();
    expect(page.getNumberOfConnectionEndpoints()).toEqual(2);

    // He re-links the nodes and executes them.
    browser.actions()
      .dragAndDrop(node1.output(2).getEndpoint(), node3.input(2).getEndpoint())
      .perform();
    node3.clickExecuteButton();
    node3.waitWhileBusy();
    expect(node3.output(1).getName()).toContain((100 + 200 + 150 + 300) / 4);

    // Frank, while annoyed that StatLets can handle this, won't give up just now...
  });

  it('should allow the user to upload a file', () => {
    // Frank want's to calculate the mean of a csv file's entries.
    // He adds a node to load the csv file.
    const node1 = page.addNodeAt(10, 10);
    node1.click();
    expect(page.editor.getTitle()).toEqual(node1.getTitle());
    page.editor.replaceTitle('loadCSVFile');
    expect(node1.getTitle()).toEqual(page.editor.getTitle());
    page.editor.replaceCode(
`function(file) {
  data <- read.csv(file=file, header=FALSE)
  column <- data$V1
  return(column)
}`,
    );
    page.editor.clickSyncButton();
    expect(node1.input(1).getName()).toContain('file');
    expect(node1.output(1).getName()).toContain('column');

    // Frank adds a node to calculate the mean.
    const node2 = page.addNodeAt(300, 10);
    node2.click();
    expect(page.editor.getTitle()).toEqual(node2.getTitle());
    page.editor.replaceTitle('average');
    expect(node2.getTitle()).toEqual(page.editor.getTitle());
    page.editor.replaceCode(
`function(column) {
  average <- mean(column)
  return(average)
}`,
    );
    page.editor.clickSyncButton();
    expect(node2.input(1).getName()).toContain('column');
    expect(node2.output(1).getName()).toContain('average');

    // Frank links the nodes together.
    browser.actions()
      .dragAndDrop(node1.output(1).getEndpoint(), node2.input(1).getEndpoint())
      .perform();

    // He chooses a file to upload.
    const fileToUpload = './dummy.csv';
    const absolutePath = path.resolve(__dirname, fileToUpload);
    node1.input(1).switchToFileInput();
    node1.enterFilePath(absolutePath);

    // Frank executes both nodes and watchs the output.
    node1.clickExecuteButton();
    node1.waitWhileBusy();
    expect(node1.output(1).getName()).toContain('');
    node2.clickExecuteButton();
    node2.waitWhileBusy();
    expect(node2.output(1).getName()).toContain('5.5');

    // Frank might think StatLets is above average, but he will try out some more stuff later...
  });

  it('should show graphics generated during execution', () => {
    // Frank would like to visualize some data.
    // He creates a node that plots two sample datasets.
    const node1 = page.addNodeAt(10, 10);
    node1.click();
    expect(page.editor.getTitle()).toEqual(node1.getTitle());
    page.editor.replaceTitle('generatePlots');
    expect(node1.getTitle()).toEqual(page.editor.getTitle());
    page.editor.replaceCode(
`function() {
  data1 <- c(1,2,3)
  data2 <- 1:10
  plot(data1)
  plot(data2)
}`,
    );
    page.editor.clickSyncButton();

    // He executes the node.
    node1.clickExecuteButton();
    node1.waitWhileBusy();
    browser.wait(ExpectedConditions.visibilityOf(node1.getGraphicSelection()), 1000);

    // Two links appear.
    expect(node1.getGraphicSelection().all(by.tagName('a')).count()).toEqual(2);

    // Frank is very proud to have generated such beautiful images. He is, however, not done with StatLets...
  });

  it('should allow manual input of parameter values', () => {
    // Frank wants to configure the input parameters of a StatLet.
    // He adds that StatLet and edits its code.
    const node1 = page.addNodeAt(10, 10);
    node1.click();
    expect(page.editor.getTitle()).toEqual(node1.getTitle());
    page.editor.replaceTitle('double');
    expect(node1.getTitle()).toEqual(page.editor.getTitle());
    page.editor.replaceCode(
`function(number) {
  doubled <- number * 2
  return(doubled)
}`,
    );
    page.editor.clickSyncButton();

    // He specifies an input value manually.
    node1.input(1).getInput().sendKeys('c(1,2,3)');

    // Frank executes the code.
    node1.clickExecuteButton();
    node1.waitWhileBusy();
    expect(node1.output(1).getText()).toContain('2,4,6');

    // Frank feels confident that tweaking parameters will be easy. But he still has things to check...
  });
});

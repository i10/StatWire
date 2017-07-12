import { $, browser, ExpectedConditions } from 'protractor';

import { StatLetsPage } from './statlets.po';

describe('StatLets', () => {
  let page: StatLetsPage;

  beforeEach(() => {
    page = new StatLetsPage();
    page.navigateTo();
  });

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
  });

  it('should allow the execution of a two-node analysis', () => {
    // Frank wants to do a quick mock analysis, to get an impression of StatLets.
    // Fist, he adds two nodes to the canvas.
    const node1 = page.addNodeAt(10, 10);
    const node2 = page.addNodeAt(10, 100);
    expect(node1.getAttribute('id')).toEqual('node-1');
    expect(node2.getAttribute('id')).toEqual('node-2');

    // He then edits the code of the first node to be a (very) simple function.
    node1.click();
    page.editor.replaceTitle('generatePrime');
    page.editor.replaceCode(
`function() {
  prime <- 11
  return(prime)
}`,
    );
    page.editor.syncButton().click();
    // To update node on the canvas, he syncs it.
    expect(node1.output(1).getText()).toContain('prime');

    // He edits the code of the second node, now even using an input parameter to his function!
    node2.click();
    page.editor.replaceTitle('double');
    page.editor.replaceCode(
`function(number) {
  double <- number * 2;
  return(double)
}`,
    );
    // Again, he syncs the node to make the parameters show up on the canvas.
    page.editor.syncButton().click();
    expect(node2.input(1).getText()).toContain('number');
    expect(node2.output(1).getText()).toContain('double');

    // Frank connects the output of the first node to the input of the second one.
    browser.actions()
      .dragAndDrop(node1.output(1).endpoint(), node2.input(1).endpoint())
      .perform();

    // He executes each node and observes that a value gets displayed when the node finishes execution.
    node1.executeButton().click();
    browser.wait(ExpectedConditions.presenceOf($('#node-1 .fa.fa-play')), 5000);
    expect(node1.output(1).getText()).toContain('11');
    expect(node2.input(1).getText()).toContain('11');
    node2.executeButton().click();
    browser.wait(ExpectedConditions.presenceOf($('#node-2 .fa.fa-play')), 5000);
    expect(node2.output(1).getText()).toContain('22');

    // Frank is very impressed with StatLets. But he is mean and will try to break it. To be continued...
  });
});

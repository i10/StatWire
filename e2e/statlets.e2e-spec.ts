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
    expect(page.editor.getTitle()).toEqual(node1.getTitle());
    expect(node1.getAttribute('id')).toEqual('node-1');
    const node2 = page.addNodeAt(10, 100);
    expect(page.editor.getTitle()).toEqual(node2.getTitle());
    expect(node2.getAttribute('id')).toEqual('node-2');

    // He then edits the code of the first node to be a (very) simple function.
    node1.click();
    expect(page.editor.getTitle()).toEqual(node1.getTitle());
    page.editor.replaceTitle('generatePrime');
    expect(node1.getTitle()).toEqual('generatePrime');
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
    expect(node2.getTitle()).toEqual('double');
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
    browser.wait(ExpectedConditions.presenceOf($('#node-1 .fa.fa-play')), 5000);
    expect(node1.output(1).getName()).toContain('11');
    expect(node2.input(1).getName()).toContain('11');
    node2.clickExecuteButton();
    browser.wait(ExpectedConditions.presenceOf($('#node-2 .fa.fa-play')), 5000);
    expect(node2.output(1).getName()).toContain('22');

    // Frank is very impressed with StatLets. But he is mean and will try to break it. To be continued...
  });
});

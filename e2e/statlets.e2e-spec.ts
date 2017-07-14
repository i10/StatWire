import { browser } from 'protractor';

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

  fit('should allow nodes to be deleted', () => {
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
    node2.clickExecuteButton();
    node3.clickExecuteButton();

    // Frank now decides, that he does not want the transformation anymore and removes it. All its connections are automatically deleted.
    // He re-links the nodes and executes them.
    // Frank, while annoyed that StatLets can handle this, won't give up just now...
  });
});

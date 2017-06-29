import { StatLetsPage } from './statlets.po';
import { browser } from 'protractor';

describe('Canvas', () => {
  let page: StatLetsPage;

  beforeEach(() => {
    page = new StatLetsPage();
    page.navigateTo();
  });

  it('should not have nodes overlapping', function () {
    const node1 = page.getNode(1);
    node1.click().then(
      () => true,
      () => fail(),
    );
  });

  it('should be draggable', function () {
    let oldLocation;
    const node1 = page.getNode(1);
    node1.getLocation().then(
      location => oldLocation = location,
    );
    browser.actions()
      .dragAndDrop(node1, {x: 100, y: 0})
      .perform();
    node1.getLocation().then(
      location => expect(location.x).toEqual(oldLocation.x + 100),
    );
  });

  describe('connections', function () {
    let node1OutputEndpoint, node2InputEndpoint;
    beforeEach(function () {
      node1OutputEndpoint = page.getOutputEndpointOfNode1();
      node2InputEndpoint = page.getInputEndpointOfNode2();
      browser.actions()
        .dragAndDrop(node1OutputEndpoint, node2InputEndpoint)
        .perform();
    });

    it('should generate two endpoint on connection', function () {
      expect(page.getAllEndpoints().count()).toEqual(2);
    });

    it('should move the endpoints with the nodes', function () {
      const node1 = page.getNode(1);
      const node2 = page.getNode(2);
      const endpoints = page.getAllEndpoints();
      expect(endpoints.count()).toEqual(2);
      const outputEndpoint = endpoints.get(0);
      const inputEndpoint = endpoints.get(1);
      let outputEndpointPosition, inputEndpointPosition;
      outputEndpoint.getLocation().then(
        location => outputEndpointPosition = location,
      );
      inputEndpoint.getLocation().then(
        location => inputEndpointPosition = location,
      );

      const offsetX = 100, offsetY = 100;
      browser.actions()
        .dragAndDrop(node2, {x: offsetX, y: offsetY})
        .perform();
      inputEndpoint.getLocation().then(
        location => {
          expect(location.x).toEqual(inputEndpointPosition.x + offsetX);
          expect(location.y).toEqual(inputEndpointPosition.y + offsetY);
        },
      );

      browser.actions()
        .dragAndDrop(node1, {x: offsetX, y: offsetY})
        .perform();
      outputEndpoint.getLocation().then(
        location => {
          expect(location.x).toEqual(outputEndpointPosition.x + offsetX);
          expect(location.y).toEqual(outputEndpointPosition.y + offsetY);
        },
      );
    });
  });

  describe('parameters', function () {
    it('should display all parameters of the statlet', function () {
      const outputs1 = page.getOutputsOf(page.getNode(1));
      expect(outputs1.getText()).toContain('loaded:');

      const inputs2 = page.getInputsOf(page.getNode(2));
      expect(inputs2.getText()).toContain('toIncrement:');
      const outputs2 = page.getOutputsOf(page.getNode(2));
      expect(outputs2.getText()).toContain('incremented:');
    });
  });
});

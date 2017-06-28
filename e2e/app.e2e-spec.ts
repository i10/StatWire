import { StatLetsPage } from './app.po';

describe('stat-lets App', () => {
  let page: StatLetsPage;

  beforeEach(() => {
    page = new StatLetsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

import { Elastika2Page } from './app.po';

describe('elastika2 App', () => {
  let page: Elastika2Page;

  beforeEach(() => {
    page = new Elastika2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

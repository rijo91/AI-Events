export class CheckboxPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1');
    this.homeTreeItem = page.getByRole('treeitem', { name: /Home/i }).first();
    this.homeCheckbox = this.homeTreeItem.getByRole('checkbox');
    this.desktopCheckbox = page.getByRole('checkbox', { name: 'Select Desktop' });
    this.documentsCheckbox = page.getByRole('checkbox', { name: 'Select Documents' });
    this.downloadsCheckbox = page.getByRole('checkbox', { name: 'Select Downloads' });
    this.expandAllButton = page.locator('.rc-tree-switcher').first();
    this.collapseAllButton = page.locator('.rc-tree-switcher').first();
  }

  async goto(url = 'https://demoqa.com/checkbox') {
    await this.page.goto(url);
  }

  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }

  async expandHome() {
    await this.expandAllButton.click();
  }

  async collapseHome() {
    await this.collapseAllButton.click();
  }
}

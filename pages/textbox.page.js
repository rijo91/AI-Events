export class TextBoxPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1');
    this.fullNameInput = page.locator('#userName');
    this.emailInput = page.locator('#userEmail');
    this.currentAddressInput = page.locator('#currentAddress');
    this.permanentAddressInput = page.locator('#permanentAddress');
    this.submitButton = page.locator('#submit');
    this.outputPanel = page.locator('#output');
    this.nameOutput = this.outputPanel.locator('#name');
    this.emailOutput = this.outputPanel.locator('#email');
    this.currentAddressOutput = this.outputPanel.locator('#currentAddress');
    this.permanentAddressOutput = this.outputPanel.locator('#permanentAddress');
  }

  async goto() {
    await this.page.goto('https://demoqa.com/text-box');
  }

  async fillForm({ fullName, email, currentAddress, permanentAddress }) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.currentAddressInput.fill(currentAddress);
    await this.permanentAddressInput.fill(permanentAddress);
  }

  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }

  async submit() {
    await this.submitButton.click();
  }
}

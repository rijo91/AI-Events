export class Login {
    constructor(page) {
        this.page = page;
        this.page.goto('https://aievents.brandingnext.com/login');
        this.page.getByPlaceholder('Email Address').fill('sreethin.babu@toobler.com');
        this.page.getByPlaceholder('Password').fill('password');
        this.page.click('button[type="submit"]');
        await expect(this.page).toHaveURL('https://aievents.brandingnext.com/lobby');
    
    }
    async loginURL() {
        await this.page.goto('/');
    }

}

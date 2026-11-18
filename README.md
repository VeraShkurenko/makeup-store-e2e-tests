# Make-Up Store – E2E Tests

![E2E tests](https://github.com/VeraShkurenko/makeup-store-e2e-tests/actions/workflows/playwright.yml/badge.svg)

Automated tests for [Make-Up Clone](https://github.com/ShVira/MakeUpClone) (online cosmetics store).
My learning project for test automation.

**Stack:** Playwright, TypeScript, Page Object Model, GitHub Actions

**Covered:** catalog, product page, cart, checkout, login, registration
**Browsers:** Chrome, Firefox, Safari, mobile Chrome
**Bugs found:** 9 – see [BUGS.md](BUGS.md)

## Run

```bash
npm install
npx playwright install
npm run app:setup
npm test
```

`npm run test:smoke` – smoke tests only
`npm run report` – open HTML report

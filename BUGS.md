# Bugs

App: [Make-Up Clone](https://github.com/ShVira/MakeUpClone) · Environment: macOS 15, Chrome / Firefox / Safari

| ID | Summary | Steps | Expected | Actual | Severity |
|---|---|---|---|---|---|
| BUG-001 | "Add to cart" button is not reachable with keyboard | 1. Open category "Чоловікам"<br>2. Tab to a product<br>3. Press Tab | Focus on "Додати у кошик" | Button is hidden until mouse hover, Tab skips it | Major |
| BUG-002 | Cart heading shows wrong number of items | 1. Add "Dior Sauvage" 3 times<br>2. Open cart | "Кошик (3)" | "Кошик (1)", badge shows 3 | Minor |
| BUG-003 | Search doesn't work | 1. Enter "Ray-Ban" in search<br>2. Press Enter | Search results | Page reloads, all products shown | Major |
| BUG-004 | Registration accepts invalid email | 1. Register with email "not-an-email" | Error message | "Реєстрація успішна!" | Major |
| BUG-005 | Login doesn't work with uppercase email | 1. Login with ADMIN@MAKEUP.COM / 123 | Successful login | "Невірний email або пароль" | Minor |
| BUG-006 | Registration with existing email redirects to login | 1. Register with admin@makeup.com | Stay on form | Error toast + redirect, data lost | Minor |
| BUG-007 | Password is stored in localStorage | 1. Login<br>2. DevTools → Local Storage | No password | `"password":"123"` in active_user | Critical |
| BUG-008 | Text errors | Check product names and counters | Correct text | "4 товарів", "Rababne", "Hererra", tab title "coursework" | Trivial |
| BUG-009 | App doesn't start on Linux (CI) | 1. Run tests in GitHub Actions | Tests pass | Empty page, all tests fail. **Fixed** | Critical |

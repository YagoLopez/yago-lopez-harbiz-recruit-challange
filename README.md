# recruit-challange
We are hiring! 🚀 If you are in our hiring process or considering Harbiz a company in which you would like to work, solve the following challenges and let us know! 😎


## Refactoring (NodeJS)
Refactor the Calendar class and make any changes you see that are usefull to fulfill these requirements:

1. All the tests must pass.
2. The code must fulfil OOP and SOLID principles.
3. The code must be maintainable.
4. The code must be extensible.
5. You must apply defensive programming practices.

See the tests for more information.

## Yago López's Proposed Solution

**Features**:

- Typescript
- ES6: arrow functions, de-structuring, [etc](https://www.w3schools.com/js/js_es6.asp) ➡️
- OOP and SOLID:
  - *Single Responsibility Principle*: calendar functionality is encapsulated in one class
  - *Open-Closed Principle*: open for extension, closed for modification (or extensibility): 
    - You can extend from `Calendar` class and add new functionality with new methods
    - You can extend from `Calendar` class and override the `loadCalendar` method to get data from other data source, for instance.
- Maintainability: 
  - Code Coverage for calendar class methods to be able to refactor safely without broking anything
  - Clean Code: `Calendar` logic is grouped in small functions (class methods) easy to understand, test and modify
- Defensive programming: error control loading calendar data

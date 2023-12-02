# Cypress SSR Localhost Mocker

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

Enhance your Cypress testing experience when working with server-side rendering frameworks like Next.js by seamlessly mocking API calls from your server to other localhost api's. Introducing Cypress SSR Localhost Mocket, a versatile and lightweight library designed to address the challenges of mocking server requests during automated tests.

#### The Challenge

Picture yourself immersed in the world of automated testing, utilizing Cypress alongside a server-side rendering framework such as Next.js. As you strive to mock an API call originating from your server to a localhost server, you naturally turn to Cypress's built-in mock methods. However, there's a catch – these methods are tailored for client-side requests, leaving you in a quandary when dealing with server-side requests.

#### The Solution

Enter **Cypress SSR Localhost Mocker**, a solution born out of real-world necessity. Initially developed to streamline testing within our own organization, this library has evolved into an open-source project, ready to empower developers facing similar challenges.

## Installation

#### Install our library in your node project

```bash
npm install cypress-ssr-localhost-mocket --save-dev
```

#### Update your cypress config

In your cypress config file, for example _cypress.config.ts_, add the following code:

```typescript
import { defineConfig } from 'cypress';
import SSRLocalhostMocker from 'cypress-ssr-mocker';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:spec', () => {
        return SSRLocalhostMocker.init(3000); // change to your localhost ports (ex: 3000, 3001, 3002, ....)
      });
      on('after:spec', () => {
        return SSRLocalhostMocker.close();
      });
      on('task', {
        mockBackendRequest: SSRLocalhostMocker.getMockBackendRequest(),
        clearAllbackendMockRequests: SSRLocalhostMocker.getClearAllMocks(),
      });
    },
  },
});
```

- On **SSRLocalhostMocker.init**, it will initialize fake's localhost servers for each port you pass. This code will run before you test stack. This is why it's on _before:spec_
- On **SSRLocalhostMocker.close**, it will close initialized servers, when your tests ends.
- On **SSRLocalhostMocker.getMockBackendRequest** and **SSRLocalhostMocker.getClearAllMocks**, is where the magic occurs. It will create the mock and clear mock methods to use in your cypress tests.

#### Customize your mock calls (optional)

If you want to create helpers to make easier to write you own tests, you can create helpers on the cypress commands. Here it's a helper example:

```typescript
import { IMockBackendRequestParams } from 'cypress-ssr-mocker';

// clear mocks before each new test
beforeEach(() => {
  cy.task('clearAllbackendMockRequests', { port: 3000 });
});

// create a helper command to mock requests
Cypress.Commands.add('mockBackendRequest', (params: IMockBackendRequestParams) => {
  cy.task('mockBackendRequest', params);
});
```

With this helper, you can create codes like:

```typescript
cy.mockBackendRequest({
  port: 3000,
  routeMock: {
    path: '/api/v3/user',
    method: 'GET',
    response: {
      statusCode: 200,
    },
  },
  fixturePath: 'my_fixture_file_path',
});
```

#### `mockBackendRequest (options)`

| Parameter                | Type   | Description                                                                                                                                                                                                               |
| ------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `port`                   | Number | The port number of your localhost you want to mock request.                                                                                                                                                               |
| `routeMock`              | Object | Object with informations about the request you want to mock, and which response you want to give                                                                                                                          |
| `fixturePath (optional)` | String | Path of your fixture (if the mock response is from a fixture). You just need to pass the fixture path, without ".json" example. For example: `user/logged`. It will load the fixture `/cypress/fixtures/user/logged.json` |

##### `routeMock`

| Parameter                  | Type     | Description                                                                                                                                                     |
| -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `method`                   | String   | Request method you want to mock. Available options: "GET" \| "POST" \| "PUT" \| "DELETE" \|                                                                     |
| `path`                     | String   | Request path you want to mock. For example, `/api/v3/user`. You will mock this path request                                                                     |
| `bodyCheckFn (optional)`   | Function | If you want to create a mock to a route just if its body match some infos, you can inform this function that receives a body hash and returns a boolean         |
| `headerCheckFn (optional)` | Function | If you want to create a mock to a route just if its boheaderdy match some infos, you can inform this function that receives a header hash and returns a boolean |
| `response`                 | Object   | Descripe the response data of the route you are mocking. It receives: { statusCode: Number; body?: Any; headers: Any; }                                         |

## Contributing

It's an open source library created to solve I specific problem I passed. Of course, that is a lot of new features that can be improved. Feel free to give some ideas, report bugs, submit fix or features, and go on...

## Changelog

All notable changes to this project will be documented in this file.

### [1.0.0] - 2023-12-02

- Initial release.

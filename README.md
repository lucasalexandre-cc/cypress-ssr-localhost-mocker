# Cypress SSR Localhost Mocker

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

Enhance your Cypress testing experience when working with server-side rendering frameworks like Next.js by seamlessly mocking API calls from your server to other localhost api's. Introducing Cypress SSR Localhost Mocker, a library designed to address the challenges of mocking server requests during automated tests.

#### The Challenge

Picture yourself immersed in the world of automated testing, utilizing Cypress alongside a server-side rendering framework such as Next.js. As you strive to mock an API call originating from your server to a localhost server, you naturally turn to Cypress's built-in mock methods. However, there's a catch – these methods are tailored for client-side requests, leaving you in a quandary when dealing with server-side requests.

#### The Solution

Enter **Cypress SSR Localhost Mocker**, a solution mock server side requests inside your cypress tests.

## Installation

#### Install our library in your node project

```bash
npm install cypress-ssr-localhost-mocker --save-dev
```

#### Update your cypress config

In your cypress config file, for example _cypress.config.ts_, add the following code:

```typescript
import { defineConfig } from 'cypress';
import SSRLocalhostMocker from 'cypress-ssr-localhost-mocker'; // import library

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:spec', () => {
        return SSRLocalhostMocker.init(3000); // it'll initialize your servers. You can pass any ports you want on params, like: (3000, 3001, 3002, ...)
      });
      on('after:spec', () => {
        return SSRLocalhostMocker.close(); // it'll close server when necessary
      });
      on('task', {
        mockBackendRequest: SSRLocalhostMocker.getMockBackendRequest(), // it'll create a helper to mock requests
        clearAllbackendMockRequests: SSRLocalhostMocker.getClearAllMocks(), // it'll create a helper to clear mock requests
      });
    },
  },
});
```

#### Recommendations (optional)

- Clear you mocker's every each test. To one test don't interfere in another, you can add the following code on you commands file, for example:

```typescript
// commands.ts

beforeEach(() => {
  cy.task('clearAllbackendMockRequests', { port: 3000 });
});
```

- If you want to create a typed helper to help you to use the mocking methods, you can create

```typescript
// commands.ts
import { IMockBackendRequestParams } from 'cypress-ssr-localhost-mocker';

Cypress.Commands.add('mockBackendRequest', (params: IMockBackendRequestParams) => {
  cy.task('mockBackendRequest', params);
});
```

With this helper, you can create tests like:

```typescript
// testing.cy.ts

describe('Testing', () => {
  it('find user picture when load page', () => {
    // this user request is called on server side, and it's mocked now
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

    cy.visit('/test_page');

    cy.find('[class*=user-picture]').should('be.visible');
  });
});
```

## Documentation

Understanding our mainly mock method and which params is supported:

#### `mockBackendRequest(options)`

| Parameter                        | Type   | Description                                                                                                                                                                                                               |
| -------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options.port`                   | Number | The port number of your localhost you want to mock request.                                                                                                                                                               |
| `options.routeMock`              | Object | Object with informations about the request you want to mock, and which response you want to give                                                                                                                          |
| `options.fixturePath (optional)` | String | Path of your fixture (if the mock response is from a fixture). You just need to pass the fixture path, without ".json" example. For example: `user/logged`. It will load the fixture `/cypress/fixtures/user/logged.json` |

##### `options.routeMock`

| Parameter                                    | Type     | Description                                                                                                                                                     |
| -------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options.routeMock.method`                   | String   | Request method you want to mock. Available options: "GET" \| "POST" \| "PUT" \| "DELETE" \|                                                                     |
| `options.routeMock.path`                     | String   | Request path you want to mock. For example, `/api/v3/user`. You will mock this path request                                                                     |
| `options.routeMock.bodyCheckFn (optional)`   | Function | If you want to create a mock to a route just if its body match some infos, you can inform this function that receives a body hash and returns a boolean         |
| `options.routeMock.headerCheckFn (optional)` | Function | If you want to create a mock to a route just if its boheaderdy match some infos, you can inform this function that receives a header hash and returns a boolean |
| `options.routeMock.response`                 | Object   | Descripe the response data of the route you are mocking. It receives: { statusCode: Number; body?: Any; headers: Any; }                                         |

## Contributing

It's an open source library created to solve I specific problem I passed. Of course, that is a lot of new features that can be improved. Feel free to give some ideas, report bugs, submit fix or features ...

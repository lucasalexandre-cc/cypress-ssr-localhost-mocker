/* eslint-disable no-undef */

import { IMockBackendRequestParams } from './index';

declare global {
  namespace Cypress {
    interface Chainable {
      mockBackendRequest(params: IMockBackendRequestParams): void;
    }
  }
}

beforeEach(() => {
  cy.task('clearAllbackendMockRequests', { port: 3000 });
});

Cypress.Commands.add('mockBackendRequest', (params: IMockBackendRequestParams) => {
  cy.task('mockBackendRequest', params);
});

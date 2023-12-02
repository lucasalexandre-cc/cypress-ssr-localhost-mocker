import SSRLocalhostMocker from './SSRLocalhostMocker';
import ExpressLocalhostServerFacory from './modules/server/ExpressLocalhostServerFacory';
export { IMockBackendRequestParams } from './types';

const expressLocalhostServerFacory = new ExpressLocalhostServerFacory();
const ssrLocalhostMocker = new SSRLocalhostMocker(expressLocalhostServerFacory);

export default ssrLocalhostMocker;

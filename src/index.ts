export * from './types';
import SSRLocalhostMocker from './SSRLocalhostMocker';
import ExpressLocalhostServerFacory from './modules/server/ExpressLocalhostServerFacory';

const expressLocalhostServerFacory = new ExpressLocalhostServerFacory();
const ssrLocalhostMocker = new SSRLocalhostMocker(expressLocalhostServerFacory);

export default ssrLocalhostMocker;

'use strict';

import TyphonLoggedEvents  from './TyphonLoggedEvents.js';

const eventbus = new TyphonLoggedEvents();

eventbus.setEventbusName('mainEventbus');

/**
 * Exports an instance of `TyphonLoggedEvents` which adds asynchronous capabilities to `Backbone.Events` which is used
 * as a main eventbus. Note that an instance of `TyphonLoggedEvents` is exported and is also associated to a mapped
 * path, `mainEventbus` in the SystemJS extra configuration data loaded by all TyphonJS repos in
 * `./config/config-app-paths.js`. By using a mapped path any other module may import the main eventbus via:
 * `import eventbus from 'mainEventbus';`
 *
 * Note the above creation of `const eventbus` is a workaround for an ESDoc bug:
 * https://github.com/esdoc/esdoc/issues/166
 *
 * Normally we can write `export default new TyphonLoggedEvents();`, but this currently breaks ESDoc.
 */
export default eventbus;
'use strict';

import _             from 'underscore';

import TyphonEvents  from './TyphonEvents.js';

import logger        from 'typhonjs-core-logging';

import Utils         from 'typhonjs-core-utils/src/Utils.js';

/**
 * TyphonLoggedEvents posts a message to the `logger` before invoking the parent TyphonEvents method.
 *
 * Adds new functionality for trigger events. The following are new trigger mechanisms:
 *
 * Please refer to the Events documentation for all inherited functionality.
 *
 * `triggerDefer` - Defers invoking `trigger`.
 *
 * `triggerFirst` - Only invokes the first target matched and passes back any result to the callee.
 *
 * `triggerResults` - Invokes all targets matched and passes back an array of results in an array to the callee.
 *
 * `triggerThen` - Invokes all targets matched and adds any returned promises through Promise.all which returns
 *  a single promise to the callee.
 */
export default class TyphonLoggedEvents extends TyphonEvents
{
   /**
    * Constructs TyphonLoggedEvents and sets the default log level to `debug` and the eventbusName to 'unknown`.
    */
   constructor()
   {
      super();

      this._logLevel = 'debug';
      this._eventbusName = 'unknown';
   }

   /**
    * Returns the any event scrubber function.
    *
    * @returns {function}
    */
   getEventScrubber()
   {
      return this._eventScrubber;
   }

   /**
    * Returns the current log level.
    *
    * @returns {string|*}
    */
   getLogLevel()
   {
      return this._logLevel;
   }

   /**
    * Sets the current event scrubber. The event scrubber is run against the event data about to be logged. It should
    *
    *
    * @param {function} eventScrubber - A function
    */
   setEventScrubber(eventScrubber)
   {
      if (!_.isFunction(eventScrubber))
      {
         if (Utils.isNullOrUndef(eventScrubber))
         {
            this._eventScrubber = undefined;
         }
         else
         {
            throw new TypeError('setEventScrubber - `eventScrubber` is not a function.');
         }
      }
      else
      {
         this._eventScrubber = eventScrubber;
      }
   }

   /**
    * Sets the current log level.
    *
    * @param {string}   logLevel - The log level to set.
    */
   setLogLevel(logLevel)
   {
      this._logLevel = logLevel;
   }

   /**
    * Defers invoking `trigger`.
    *
    * @returns {TyphonLoggedEvents}
    */
   triggerDefer()
   {
      setTimeout(() => { this.trigger(...arguments); }, 0);

      return this;
   }

   /**
    * Posts a log message given the current log level.
    *
    * Trigger callbacks for the given event, or space-delimited list of events. Subsequent arguments to trigger will be
    * passed along to the event callbacks.
    *
    * @see http://backbonejs.org/#Events-trigger
    *
    * @param {string}   name  - Event name(s)
    * @returns {TyphonLoggedEvents}
    */
   trigger(name)
   {
//      const params = arguments.length > 1 ? _.map(Array.prototype.slice.call(arguments, 1), _.clone) : [];
      const params = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];

      const logData = { busName: this._eventbusName, triggerType: 'trigger', eventName: name, params };

      logger.post(this._logLevel, !Utils.isNullOrUndef(this._eventScrubber) ? this._eventScrubber(logData) : logData);

      return super.trigger(...arguments);
   }

   /**
    * Posts a log message given the current log level.
    *
    * Provides `trigger` functionality that only invokes the first target matched and passes back any result to
    * the callee.
    *
    * @param {string}   name  - Event name(s)
    * @returns {*}
    */
   triggerFirst(name)
   {
      const params = arguments.length > 1 ? _.map(Array.prototype.slice.call(arguments, 1), _.clone) : [];

      const results = super.triggerFirst(...arguments);

      const logData = { busName: this._eventbusName, triggerType: 'triggerFirst', eventName: name, params, results };

      logger.post(this._logLevel, !Utils.isNullOrUndef(this._eventScrubber) ? this._eventScrubber(logData) : logData);

      return results;
   }

   /**
    * Posts a log message given the current log level.
    *
    * Provides `trigger` functionality, but collects any returned results from invoked targets in an array and passes
    * back this array to the callee.
    *
    * @param {string}   name  - Event name(s)
    * @returns {Array<*>}
    */
   triggerResults(name)
   {
      const params = arguments.length > 1 ? _.map(Array.prototype.slice.call(arguments, 1), _.clone) : [];

      const results = super.triggerResults(...arguments);

      const logData = { busName: this._eventbusName, triggerType: 'triggerResults', eventName: name, params, results };

      logger.post(this._logLevel, !Utils.isNullOrUndef(this._eventScrubber) ? this._eventScrubber(logData) : logData);

      return results;
   }

   /**
    * Posts a log message given the current log level.
    *
    * Provides `trigger` functionality, but collects any returned Promises from invoked targets and returns a
    * single Promise generated by `Promise.all`. This is a very useful mechanism to invoke asynchronous operations
    * over an eventbus.
    *
    * @param {string}   name  - Event name(s)
    * @returns {Promise}
    */
   triggerThen(name)
   {
      const params = arguments.length > 1 ? _.map(Array.prototype.slice.call(arguments, 1), _.clone) : [];

      const logData = { busName: this._eventbusName, triggerType: 'triggerThen', eventName: name, params };

      logger.post(this._logLevel, !Utils.isNullOrUndef(this._eventScrubber) ? this._eventScrubber(logData) : logData);

      return super.triggerThen(...arguments);
   }
}
/**
 * typhonExtend.js (TyphonJS) -- Extends Backbone for use with TyphonJS.
 */

'use strict';

import _ from 'underscore';

/**
 * Provides support for TyphonJS adding several methods to Backbone.
 *
 * @param {Backbone} Backbone - Backbone instance
 */
export default function typhonExtend(Backbone)
{
   Backbone.isCollection = (collection) =>
   {
      return !_.isUndefined(collection) && collection !== null && collection instanceof Backbone.Collection;
   };

   Backbone.isEventbus = (eventbus) =>
   {
      return !_.isUndefined(eventbus) && eventbus !== null && (eventbus instanceof Backbone.Events ||
       eventbus instanceof Backbone.Events.constructor);
   };

   Backbone.isViewCtor = (viewCtor) =>
   {
      return !_.isUndefined(viewCtor) && viewCtor !== null && viewCtor instanceof Backbone.View.constructor;
   };

   Backbone.isModel = (model) =>
   {
      return !_.isUndefined(model) && model !== null && model instanceof Backbone.Model;
   };

// Add ViewController support to Backbone.View ----------------------------------------------------------------------

   Backbone.View.prototype.close = function(remove = false)
   {
      if (!_.isBoolean(remove))
      {
         throw new TypeError('close - remove is not a boolean.');
      }

      if (this.onBeforeClose)
      {
         // onBeforeClose may veto closing
         let closeable = this.onBeforeClose();
         closeable = _.isBoolean(closeable) ? closeable : true;

         if (!closeable)
         {
            return false;
         }
      }

      this.stopListening();
      this.unbind();
      this.undelegateEvents();

      if (remove)
      {
         this.$el.remove();
      }
      else
      {
         this.$el.empty();
      }

      if (this.onDestroy)
      {
         this.onDestroy();
      }

      return true;
   };

// Empty function that gets called by ViewController.setCurrentView when the same view is requested to be shown;
// useful for passing messages to views.
   Backbone.View.prototype.onContinue = () => {};


// The following functions provide lifecycle events used in various group views like tab-view-group.js
   Backbone.View.prototype.onStart = function()
   {
      this.render();
   };

   Backbone.View.prototype.onResume = function()
   {
      this.render();
   };

   Backbone.View.prototype.onPause = function()
   {
      this.undelegateEvents();
   };
}
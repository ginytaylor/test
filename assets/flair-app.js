/**
 * NOTE: This file is generated by the Flair app and should not be modified.
 *
 * Any changes made to this file will be overwritten the next time you change
 * your Flair settings.
 *
 * Flair: https://apps.shopify.com/flair
 *
 * Copyright Brainy Atom LLC, All Rights Reserved.
 *
 * version: 0.3.1
 * Last updated: 2021-09-13T06:09:26Z
 */
window.FlairApp = (function() {
  return {
    debug: window.location.search.includes('flairdebug'),
    /**
     * Listen for changes and fire a callback.
     *
     * on             - change or click are supported
     * selector       - a string containing one or more selectors to match against
     * parentSelector - a string matching the parent selector to listen for this event
     * url            - the product url; defaults to current url
     * variant        - the optional variant ID; defaults to current variant id
     * delay          - the number of milliseconds to delay; defaults to 100
     */
    onEventRefreshProductBadges: function(options) {
      options = options || {};
      var selector = options.selector || '.single-option-selector';
      var parentSelector = options.parentSelector || 'form[action="/cart/add"]';
      if (this.debug) {
        console.log("[Flair] setting up event listener for refresh badges", options.on, parentSelector, selector);
      }
      var callback = function() {
        var delay = options.delay || 100;
        setTimeout(function() {
          var sections = this.currentSections('badge');
          for (var i=0; i<sections.length; i++) {
            var opts = {
              url: options.url,
              section: sections[i],
              variant: options.variant || this.currentVariantId(),
            };
            this.refreshProductBadges(opts);
          }
        }.bind(this), delay);
      }.bind(this);
      var parentEls = document.querySelectorAll(parentSelector);
      if (parentEls.size == 0) {
        if (this.debug) {
          console.log("[Flair] warning - parent selector could not be found, using document", parentSelector);
        }
        parentEls = [document];
      }
      for (var i=0; i<parentEls.length; i++) {
        var parentEl = parentEls[i];
        parentEl.addEventListener(options.on, function(event) {
          if (event.target.matches(selector)) {
            if (this.debug) {
              console.log("[Flair] badge refresh event detected", options.on, parentSelector, selector);
            }
            callback();
          }
        });
      }
    },

    /**
     * Private
     * Get the current variant id
     */
    currentVariantId: function() {
      var el = document.querySelector('[name=id]');
      if (el) {
        return el.value;
      } else { // fall back on url
        return window.location.search.replace(/.*variant=(\d+).*/, '$1');
      }
    },

    /**
     * Private
     * Get the current sections on the page
     */
    currentSections: function(type) {
      var selector = type == 'banner' ? '.flair-banner-layout' : '.flair-badge-layout'
      var els = document.querySelectorAll(selector);
      var result = [];
      for (var i=0; i<els.length; i++) {
        var el = els[i];
        var section = el.dataset.section;
        if (section && result.indexOf(section) < 0) {
          result.push(section);
        }
      }
      return result;
    },

    /**
     * Get the Flair product badges for one product.
     *
     * options
     *   url     - the product url; defaults to current url
     *   section - the Flair badges section name; defaults to 'flair-product-badges'
     *   variant - the variant ID; defaults to null
     */
    getProductBadges: function(options) {
      options = options || {};
      var url = options.url || window.location.href;
      var section = options.section || 'flair-product-badges';
      var params = { section_id: section };
      if (options.variant) {
        params.variant = options.variant;
      }
      url = this.buildUrl(url, params);
      return this.getUrl(url);
    },

    /**
     * Get the Flair product badges for multiple products.
     *
     * options
     *   ids     - the Array of Shopify product IDs
     *   section - the Flair badges section name; defaults to 'flair-product-badges'
     */
    getProductBadgesMulti: function(options) {
      options = options || {};
      var ids = options.ids || [];
      if ( ids.length == 0 ) {
        return new Promise(function(resolve, reject) { resolve(''); });
      }
      var section = options.section || 'flair-product-badges';
      var q = '';
      for (var i=0; i<ids.length; i++) {
        if (i > 0) {
          q += ' OR '
        }
        q += 'id:' + ids[i].toString()
      }
      var params = { q: q, section_id: section };
      var url = this.buildUrl("/search", params);
      return this.getUrl(url);
    },

    /**
     * Private
     * Refresh the product badges for a product.
     *
     * options
     *   url     - the product url; defaults to current url
     *   section - the Flair badges section name; defaults to 'flair-product-badges'
     *   variant - the variant ID; defaults to null
     */
    refreshProductBadges: function(options) {
      options = options || {};
      var opts = {
        url: options.url,
        section: options.section,
        variant: options.variant,
      };
      if (this.debug) {
        console.log("[Flair] refreshing product badges");
      }
      this.getProductBadges(opts).then(function(badges) {
        if (this.debug) {
          console.log("[Flair] got badges", badges);
        }
        var doc = new DOMParser().parseFromString(badges, 'text/html');
        var el = doc.querySelector('.flair-badge-layout');
        if (el) {
          var selector = el.dataset.selector;
          var els = document.querySelectorAll(selector);
          if (this.debug) {
            console.log("[Flair] replacing badges", selector, els);
          }
          for (var i=0; i<els.length; i++) {
            var copy = el.cloneNode(true);
            var orig = els[i];
            orig.parentNode.replaceChild(copy, orig);
          };
        }
      }.bind(this));
    },

    /**
     * Listen for clicks to add to cart button.
     *
     * on        - change or click are supported
     * selector  - a string containing one or more selectors to match against
     * url       - the product url; defaults to current url
     * sections  - the Flair banner section names
     * delay     - the number of milliseconds to delay; defaults to 100
     */
    onEventRefreshBanners: function(options) {
      options = options || {};
      var callback = function() {
        var delay = options.delay || 100;
        setTimeout(function() {
          var sections = options.sections || [];
          for (var i=0; i<sections.length; i++) {
            var opts = {
              url: options.url,
              section: sections[i],
            };
            this.refreshBanners(opts);
          }
        }.bind(this), delay);
      }
      var selector = options.selector || '.product-form__cart-submit'
      var els = document.querySelectorAll(selector);
      if (this.debug) {
        console.log("[Flair] setting up event listener for refresh banners", options.on, selector, els);
      }
      for (var i=0; i<els.length; i++) {
        var el = els[i];
        el.addEventListener(options.on, callback.bind(this));
      }
    },

    /**
     * Get the banners for the current page.
     *
     * options
     *   url     - the url; defaults to current url
     *   section - the Flair banners section name; defaults to 'flair-banners'
     */
    getBanners: function(options) {
      options = options || {};
      var url = options.url || window.location.href;
      var section = options.section || 'flair-banners';
      var params = { section_id: section };
      url = this.buildUrl(url, params);
      return this.getUrl(url);
    },

    /**
     * Private
     * Refresh the banners for the current page.
     *
     * options
     *   url     - the url; defaults to current url
     *   section - the Flair banners section name; defaults to 'flair-banners'
     */
    refreshBanners: function(options) {
      options = options || {};
      var opts = {
        url: options.url,
        section: options.section,
      };
      this.getBanners(opts).then(function(banners) {
        var doc = new DOMParser().parseFromString(banners, 'text/html');
        var el = doc.querySelector('.flair-banner-layout');
        if (el) {
          var selector = el.dataset.selector;
          var els = document.querySelectorAll(selector);
          for (var i=0; i<els.length; i++) {
            var copy = el.cloneNode(true);
            var orig = els[i];
            orig.parentNode.replaceChild(copy, orig);
          };
        }
      });
    },

    /**
     * Private
     * Build a url with query params
     */
    buildUrl: function(url, params) {
      var u = url;
      if (params) {
        u = u.split('?')[0];
        var keys = Object.keys(params);
        for (var i=0; i<keys.length; i++) {
          if (i == 0) {
            u += '?';
          } else {
            u += '&';
          }
          var key = keys[i];
          u += key + '=' + params[key];
        }
      }
      return u;
    },

    /**
     * Private
     * Get data from a url
     *
     * url - the URL to get
     */
    getUrl: function(url) {
      var promise = fetch(url).then(function(response) {
        if (response.ok) {
          return response.text();
        } else {
          console.log("[Flair] Error fetching url", response.status);
          return "";
        }
      }).then(function(data) {
        return data;
      }).catch(function(err) {
        console.log("[Flair] Error getting url", err);
        return "";
      });
      return promise;
    },

    initCountdownTimers: function() {
      var delay = 1000;
      var callback = function() {
        FlairApp.updateCountdownTimers();
        setTimeout(function() {
          callback()
        }, delay);
      }
      callback();
    },

    updateCountdownTimers: function() {
      var els = document.querySelectorAll(".flair-banner-countdown");
      var twoDigit = function(n) {
        return (n < 10) ? '0' + n : n;
      }
      els.forEach(function(el) {
        var countdown = el.dataset.time * 1000;
        var now = new Date().getTime();
        var distance = countdown - now;
        if ( distance > 0 ) {
          el.style.display = 'inline-flex';
          var day = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var second = Math.floor((distance % (1000 * 60)) / 1000);
          el.querySelector('[data-day]').innerText=twoDigit(day);
          el.querySelector('[data-hour]').innerText=twoDigit(hour);
          el.querySelector('[data-minute]').innerText=twoDigit(minute);
          el.querySelector('[data-second]').innerText=twoDigit(second);
          if (day == 0) {
            el.querySelectorAll('[data-section="day"]').forEach(function(e) {
              e.style.display = 'none';
            });
          }
        } else {
          el.style.display = 'none';
        }
      })
    },
  };
})();

'use strict';

/**
 * Get the locale from the request header, params or body
 * @param req
 * @returns {String}
 */
function getLocaleFromRequest (req) {
    return req.headers.locale || req.params.locale || req.body.locale;
}

/**
 * Get the site from the request header, params, or body
 * @param req
 * @returns {String}
 */
function getSiteFromRequest (req) {
    return req.headers.site || req.params.site || req.body.site || req.body.referrer;
}

module.exports = {
    getLocaleFromRequest: getLocaleFromRequest,
    getSiteFromRequest: getSiteFromRequest
};

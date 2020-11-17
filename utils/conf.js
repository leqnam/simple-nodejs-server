/*
    Created by Nam Le
    leqnam@Live.com
    https://nready.net
*/

"use strict";

module.exports = {
    'secret': 'nlenlenle',
    'sessionMaxAge': 360000, // 60 s = 60000
    'tokenMaxAge': 360000,

    "cors": {
        "enabled": false
    },

    "cron": {
        "reset": "0 * * * *"
    },

    "direct": {
        "rootNamespace": "Server",
        "apiName": "API",
        "apiUrl": "/api",
        "classRouteUrl": "/api",
        "classPath": "api",
        "server": "localhost",
        "port": "4000",
        "protocol": "http",
        "timeout": 30000,
        "cacheAPI": false,
        "relativeUrl": true,
        "appendRequestResponseObjects": true,
        "enableProcessors": false,
        "enableMetadata": true,
        "responseHelper": true
    },

    "database": {
        "dialect": "sqlite",
        "storage": ".//db.db",
        "logging": false,
        "define": {
            "createdAt": "created",
            "updatedAt": "updated",
            "deletedAt": "deleted",
            "underscored": true
        }
    },

    "session": {
        "secret": "1122",
        "duration": 86400,
        "readonly": false
    },

    "client": {
        "path": "../nrdtraine/build/testing/nrdEmp"
    }
};
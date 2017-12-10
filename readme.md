![Generic-joi-validator Logo](https://raw.github.com/wearereasonablepeople/generic-joi-validator/master/images/gjv.png)

# Generic Joi Validator
[![Build Status](https://travis-ci.org/wearereasonablepeople/generic-joi-validator.svg?branch=master)](https://travis-ci.org/wearereasonablepeople/generic-joi-validator)
[![codecov](https://codecov.io/gh/wearereasonablepeople/generic-joi-validator/branch/master/graph/badge.svg)](https://codecov.io/gh/wearereasonablepeople/generic-joi-validator)

## Installation
```
npm install generic-joi-validator
```

## Description
This package facilitates managing multiple Joi structures and running validation on them.

## Current translators
[mongoose-to-joi-translator](https://github.com/wearereasonablepeople/mongoose-to-joi-translator)

More are coming soon. Got a new translator? Create an issue and I'll include it.

## Usage

Requiring methods from the package.
```
const { schemata, prepare } = require('generic-joi-validator');
```

Add domain models to your schemata object.
You may use your mongoose database models directly with [mongoose-to-joi-translator](https://github.com/wearereasonablepeople/mongoose-to-joi-translator).

```
const getJoiSchema = require('mongoose-to-joi-translator');
schemata.stores = getJoiSchema(new Schema({
    name: {
        type: String,
        required: true
    },
    location: new Schema({
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        }
    })
}));
```

Add your schema manually
```
schemata.stores = {
    name: Joi.string().required(),
    location: {
        latitude: Joi.string().required(),
        longitude: Joi.string().required()
    }
};
```

Other domain models may also be included
Examples:
* schemata.storesQuery to contain what is queryable in stores and validates user input based on it.
* schemata.pagination to contain the pagination structure.
```
schemata.pagination = {
    skip: Joi.number().optional().default(defaultSkip),
    limit: Joi.number().optional().default(defaultLimit)
};
```

An example of how to use this package with Koa

Create middleware
```
// You may also create middlewares for getQuery input, getPagination input, etc.

/**
* Koa-specific Wrapper for the prepare function, looks for data in the body, params, and query
* of ctx.request and assign the validated data to ctx.state.data
* @param {String} [params] list of strings in space-separated value format, example 'word location.latitude location.longitude'.
* By default it will check all properties found in the specified joi structure.
* @param {Boolean} [areOptional] specifies whether the attributes are optional
* (overrides required check) useful for partial update validation
*/
const koaValidator = (params, areOptional) => (ctx, next) => {
    // takes foo from '/foo/something/another'
    const resourceName = ctx.url.replace(/^\/([^/]*).*$/, '$1');
    // source the object the validator will look through
    const source = {
        ...ctx.request.body,
        ...ctx.params,
        ...ctx.request.query
    };
    const {error, value} = prepare(resourceName, source, params, areOptional);
    ctx.assert(!error, 400, {message: error ? error.message : error});
    ctx.state.data = {...ctx.state.data, ...value};
    return next();
};
```
Use in your routes
```
router.post(
    '/stores',
    koaValidator(),
    async (ctx, next) => {
        ctx.body = ctx.state.data;
        return next();
    }
);
```

## Test
```
npm test
```

## Documentation

## Members

<dl>
<dt><a href="#schemata">schemata</a></dt>
<dd><p>property that contains all schemata to check against,
the property isJoi in each schema is reserved.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#prepare">prepare(resourceName, sourceObject, [attributes], [areOptional])</a> ⇒ <code>Object</code></dt>
<dd><p>validates the object based on the schema of the resource</p>
</dd>
</dl>

<a name="schemata"></a>

## schemata
property that contains all schemata to check against,
the property isJoi in each schema is reserved.

**Kind**: global variable  
<a name="prepare"></a>

## prepare(resourceName, sourceObject, [attributes], [areOptional]) ⇒ <code>Object</code>
validates the object based on the schema of the resource

**Kind**: global function  
**Returns**: <code>Object</code> - same as Joi.valdidate return value  

| Param | Type | Description |
| --- | --- | --- |
| resourceName | <code>String</code> | resource name |
| sourceObject | <code>Object</code> | location of attributes to validate |
| [attributes] | <code>String</code> | list of attributes to be checked in space-separated value format, defaults to all. |
| [areOptional] | <code>Boolean</code> | specifies whether the attributes specified are optional |


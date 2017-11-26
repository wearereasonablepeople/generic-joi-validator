## Usage
```
const { JoiValidator } = require('generic-joi-validator');
const joiValidator = new JoiValidator();

// Use a translator to extract Joi schema from your database
const mongoose = require('mongoose');
const { Schema } = mongoose;
const getJoiSchema = require('mongoose-to-joi-translator');
joiValidator.schemata.stores = getJoiSchema(new Schema({
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


// or add your schema manually
joiValidator.schemata.stores = {
    name: Joi.string().required(),
    location: {
        latitude: Joi.string().required(),
        longitude: Joi.string().required()
    }
};

// With koa
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

const router = new Router();
const app = new Koa();

app.use(bodyParser());

const koaValidator = async (ctx, next) => {
    const { error, value } = joiValidator.prepare(ctx.url.substr(ctx.url.lastIndexOf('/') + 1), ctx.request.body);
    ctx.assert(!error, 400, value);
    ctx.state.data = value;
    return next();
};

router.post(
    '/stores',
    koaValidator,
    async (ctx, next) => {
        ctx.body = ctx.state.data;
        return next();
    }
);

app.use(router.allowedMethods({ throw: true }));
app.use(router.routes());

app.listen(3000);
```

## Install
```
npm install generic-joi-validator
```

## Test
```
npm test
```

## Members

<dl>
<dt><a href="#schemata">schemata</a></dt>
<dd><p>property that contains all schemata to check against,
the property isJoi in each schema is reserved.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#prepare">prepare(resourceName, sourceObject, [attributes])</a> ⇒ <code>Object</code></dt>
<dd><p>validates the object based on the schema of the resource</p>
</dd>
</dl>

<a name="schemata"></a>

## schemata
property that contains all schemata to check against,
the property isJoi in each schema is reserved.

**Kind**: global variable  
<a name="prepare"></a>

## prepare(resourceName, sourceObject, [attributes]) ⇒ <code>Object</code>
validates the object based on the schema of the resource

**Kind**: global function  
**Returns**: <code>Object</code> - same as Joi.valdidate return value  

| Param | Type | Description |
| --- | --- | --- |
| resourceName | <code>String</code> | resource name |
| sourceObject | <code>Object</code> | location of attributes to validate |
| [attributes] | <code>String</code> | list of attributes to be checked in space-separated value format, defaults to all. |


## Status
Alpha

## Usage
```
const { JoiValidator } = require('generic-joi-validator');
const joiValidator = new JoiValidator();

// Use a translator to extract Joi schema from your database
joiValidator.schemata.stores = getJoiSchema(new Schema({
name: Joi.string().required(),
location: {
latitude: Joi.string().required(),
longitude: Joi.string().required()
}
}));

// or add your schema manually
joiValidator.schemata.stores = {
name: Joi.string().required(),
location: {
latitude: Joi.string().required(),
longitude: Joi.string().required()
}
};

// With koa (pseudocode)
async (ctx, next) => {
const resourceName = // get it from ctx.url;
const sourceObject = // ctx.request.body or wherever, you may use multiple;
const { error, value } = joiValidator.prepare(resourceName, sourceObject);
...
}
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


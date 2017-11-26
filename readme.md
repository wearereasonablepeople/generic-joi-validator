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


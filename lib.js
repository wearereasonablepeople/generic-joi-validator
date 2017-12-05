'use strict';

const Joi = require('joi');
const lodash = require('lodash');
const assert = require('assert');

// ---------------------
// credits
// https://stackoverflow.com/q/15690706
const isObject = val =>
  typeof val === 'object' && !Array.isArray(val);

const paths = (obj = {}) =>
  Object.entries(obj)
  .reduce(
    (product, [key, value]) =>
      (isObject(value) && !value.isJoi) ?
        product.concat([
          // adds [root, [children]] list
          [key, paths(value)]
        ]) :
        // adds [child] list
        product.concat([key]),
    []
  );

const addDelimiter = (a, b) =>
  a ? `${a}.${b}` : b;

const pathToString = ([root, children]) =>
  children.map(
    child =>
      Array.isArray(child) ?
        addDelimiter(root, pathToString(child)) :
        addDelimiter(root, child)
  )
  .join(' ');
// ----------------------

/**
 * property that contains all schemata to check against,
 * the property isJoi in each schema is reserved.
 */
exports.schemata = {};

/**
 * validates the object based on the schema of the resource
 * @param {String} resourceName resource name
 * @param {Object} sourceObject location of attributes to validate
 * @param {String} [attributes] list of attributes to be checked in space-separated value format,
 * defaults to all.
 * @param {Boolean} [areOptional] specifies whether the attributes specified are optional
 * @returns {{error: Object, value: Object}} same as Joi.valdidate return value
 */
exports.prepare = function(resourceName, sourceObject, attributes, areOptional) {
  let schema = exports.schemata[resourceName];
  // if schema is not found
  assert(schema, `Schema: ${resourceName} was not found.`);

  // filters schema if a subset of the attributes is required
  if(attributes) {schema = lodash.pick(schema, attributes.split(' '));}

  const schemaAttributes = pathToString(['', paths(schema)]).split(' ');

  if(areOptional) {
    schemaAttributes.forEach(schemaAttribute => {
      lodash.set(schema, schemaAttribute, lodash.get(schema, schemaAttribute).optional());
    });
  }

  const questionableObj = lodash.pick(sourceObject, schemaAttributes);

  return Joi.validate(questionableObj, schema);
};

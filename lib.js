'use strict';

const Joi = require('joi');
const lodash = require('lodash');
const assert = require('assert');

exports.JoiValidator = function () {
    /**
     * property that contains all schemata to check against,
     * the property isJoi in each schema is reserved.
     */
    this.schemata = {};

    /**
     * validates the object based on the schema of the resource
     * @param {String} resourceName resource name
     * @param {Object} sourceObject location of attributes to validate
     * @param {String} [attributes] list of attributes to be checked in space-separated value format, defaults to all.
     * @returns {{error: Object, value: Object}} same as Joi.valdidate return value
     */
    this.prepare = function(resourceName, sourceObject, attributes){
        let schema = this.schemata[resourceName];
        // if schema is not found
        assert(schema, `Schema: ${resourceName} was not found.`);

        // filters schema if a subset of the attributes is required
        if(attributes) schema = lodash.pick(schema, attributes);

        const questionableObj = lodash.pick(sourceObject, pathToString(['', paths(schema)]).split(' '));

        return Joi.validate(questionableObj, schema);
    };
};


// ---------------------
// credits
// https://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list
const isObject = val =>
    typeof val === 'object' && !Array.isArray(val);

const paths = (obj = {}) =>
    Object.entries(obj)
        .reduce(
            (product, [key, value]) =>
                (isObject(value) && !value.isJoi) ?
                    product.concat([
                        [key, paths(value)] // adds [root, [children]] list
                    ]) :
                    product.concat([key]), // adds [child] list
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
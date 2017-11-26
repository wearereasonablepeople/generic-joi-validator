'use strict';

const { JoiValidator } = require('../lib');
const Joi = require('joi');
const lodash = require('lodash');

describe('lib', () => {
    describe('#prepare', () => {
        let joiValidator,
            goodObject = { name: 'some name', location: { latitude: '123', longitude: '321' } };
        beforeEach(() => {
            joiValidator = new JoiValidator();
            joiValidator.schemata.stores = {
                name: Joi.string().required(),
                location: {
                    latitude: Joi.string().required(),
                    longitude: Joi.string().required()
                }
            };
        });
        afterEach(() => {
            joiValidator.schemata = {};
        });
        it('should return full object', () => {
            const { error, value } = joiValidator.prepare('stores', goodObject);
            expect(error).toBeNull();
            expect(value).toEqual(goodObject);
        });
        it('should return partial object', () => {
            const { error, value } = joiValidator.prepare('stores', goodObject, 'location.latitude');
            expect(error).toBeNull();
            console.log(value);
            expect(value).toEqual(lodash.pick(goodObject, 'location.latitude'));
        });
        it('should throw an error if schema was not found', () => {
            expect(() => joiValidator.prepare('someSchema', goodObject, 'location.latitude'))
                .toThrow();
        });
    });
});

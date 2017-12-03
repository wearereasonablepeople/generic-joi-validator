'use strict';

const {prepare} = require('../lib');
let {schemata} = require('../lib');
const Joi = require('joi');
const lodash = require('lodash');

describe('lib', () => {
  describe('#prepare', () => {
    const goodObject = {name: 'some name', location: {latitude: '123', longitude: '321'}};
    beforeEach(() => {
      schemata.stores = {
        name: Joi.string().required(),
        location: {
          latitude: Joi.string().required(),
          longitude: Joi.string().required()
        }
      };
    });
    afterEach(() => {
      schemata = {};
    });
    it('should return full object', () => {
      const {error, value} = prepare('stores', goodObject);
      expect(error).toBeNull();
      expect(value).toEqual(goodObject);
    });
    it('should return partial object', () => {
      const {error, value} = prepare('stores', goodObject, 'location.latitude');
      expect(error).toBeNull();
      expect(value).toEqual(lodash.pick(goodObject, 'location.latitude'));
    });
    it('should throw an error if schema was not found', () => {
      expect(() => prepare('someSchema', goodObject, 'location.latitude'))
        .toThrow();
    });
    it('should not throw error on optional fields that are originally required', () => {
      delete goodObject.location.longitude;
      const {error, value} = prepare('stores', goodObject,
        'location.latitude location.longitude name', true);
      expect(error).toBeNull();
      expect(value).toEqual(goodObject);
    });
    it('should validate all fields if parameters are not sent but optional is true', () => {
      const {error, value} = prepare('stores', goodObject,
        '', true);
      expect(error).toBeNull();
      expect(value).toEqual(goodObject);
    });
  });
});

import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

export default Model.extend({
  value: attr(),
  description: attr(),
  fingerprint: attr(),
  isCustom: true
});

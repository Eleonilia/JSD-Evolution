import * as mongoose from 'mongoose';

const rawSchemaUnionSchema = new mongoose.Schema({
  'batchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required: true},
  'rawSchemaFinal': {type: String, required: true},
  'my_version': {type: Number, default: 0, ref:'RawSchemaBatch'}
}, {timestamps: {createdAt: 'createdAt'}});

rawSchemaUnionSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.rawSchemaFinal = JSON.parse(ret.rawSchemaFinal);
    return ret;
  }
});

export default mongoose.model('RawSchemaUnion', rawSchemaUnionSchema);

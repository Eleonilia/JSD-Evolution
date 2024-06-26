import * as mongoose from 'mongoose';

const JsonSchemaExtractedSchema = new mongoose.Schema({
  'batchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required: true},
  'jsonSchema': {type: String, required: true},
  'my_version': {type: Number, default: 0, ref:'RawSchemaBatch'}
  
}, {timestamps: {createdAt: 'createdAt'}});

JsonSchemaExtractedSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.jsonSchema = JSON.parse(ret.jsonSchema);
    return ret;
  }
});

export default mongoose.model('JsonSchemaExtracted', JsonSchemaExtractedSchema);

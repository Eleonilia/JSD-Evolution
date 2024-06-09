import * as mongoose from 'mongoose';

const rawSchemaSchema = new mongoose.Schema({
  'batchId': {type: mongoose.Schema.Types.ObjectId, ref: 'RawSchemaBatch', required: true},
  'docRawSchema': {type: String, required: true},
  'my_version': {type: Number, default: 0, ref:'RawSchemaBatch'}
}, {timestamps: {createdAt: 'createdAt'}});

export default rawSchemaSchema;

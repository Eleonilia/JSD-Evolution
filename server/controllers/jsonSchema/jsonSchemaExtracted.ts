import JsonSchemaBuilder from '../../helpers/jsonSchema/jsonSchemaBuilder';
import JsonSchemaExtracted from '../../models/jsonSchema/jsonSchemaExtracted';
import BatchBaseController from '../batchBase';
import RawSchemaBatch from '../rawSchema/rawSchemaBatch';
import RawSchemaUnion from '../rawSchema/rawSchemaUnion';

export default class JsonSchemaExtractedController extends BatchBaseController {

  model = JsonSchemaExtracted;

  generate = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      let rawSchemaBatch;
      new RawSchemaBatch().getById(batchId).then((data) => {
        if (!data)
          return reject({'message': `no results for batchId: ${batchId}`, 'code': 404});
        rawSchemaBatch = data;
        return new RawSchemaUnion().listEntitiesByBatchId(batchId);
      }).then((data) => {
        return this.buildJsonSchema(data, batchId);
      }).then((data) => {
        rawSchemaBatch.endDate = new Date();
        rawSchemaBatch.status = 'DONE';
        rawSchemaBatch.statusType = 'DONE';
        return rawSchemaBatch.save();
      }).then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject({'type': 'MAPPER_JSONSCHEMA_ERROR', 'message': error.message, 'code': 500});
      });
    });
  };


  private buildJsonSchema = (rawSchemaUnions, batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      const rawSchemaUnion = rawSchemaUnions.pop();
      const my_version = rawSchemaUnion.my_version;
  
      if (!rawSchemaUnion) {
        throw `no results for batchId: ${batchId}`;
      }
      const rawSchemaFinal = JSON.parse(rawSchemaUnion.rawSchemaFinal);
  
      const jsonSchemaGenerated = new JsonSchemaBuilder().build(
        rawSchemaFinal.fields,
        rawSchemaFinal.count
      );
  
      const jsonSchemaExtracted = {
        jsonSchema: JSON.stringify(jsonSchemaGenerated),
        my_version: my_version,
        batchId: batchId, // Adicione o batchId aqui
      };
  
      this.model.findOneAndUpdate(
        { batchId: batchId },
        { $set: jsonSchemaExtracted },
        { upsert: true, new: true }
      ).then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject(error);
      });
    });
  };
  
  };

import RawSchemaUnifier from '../../helpers/rawSchema/rawSchemaUnifier';
import RawSchemaUnion from '../../models/rawSchema/rawSchemaUnion';
import BatchBaseController from '../batchBase';

export default class RawSchemaUnionController extends BatchBaseController {

  model = RawSchemaUnion;

  union = (rawSchemaResults, batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      if (!rawSchemaResults || rawSchemaResults.length == 0)
        throw `no results for batchId: ${batchId}`;
      console.log(`Os esquemas estão como id, então ele pega o esquema bruto e realiza a união`)
      const rawSchemaFinal = new RawSchemaUnifier().union(rawSchemaResults);
      const rawSchemaUnion = new RawSchemaUnion({
        'batchId': batchId,
        'rawSchemaFinal': JSON.stringify(rawSchemaFinal)
      });
      rawSchemaUnion.save().then((data) => {
        resolv(data);
      }, (error) => {
        reject(error);
      });
    });
  };


  

  union_up_2 = (rawSchemaResults, batchId, my_version): Promise<any> => {
    return new Promise((resolv, reject) => {
      if (!rawSchemaResults || rawSchemaResults.length == 0) {
        throw `no results for batchId: ${batchId}`;
      }
  
      // Recupere o documento existente por batchId
      this.model.findOne({ 'batchId': batchId })
        .then((existingDoc) => {
          // Atualize os campos necessários
  
          const rawSchemaFinal = new RawSchemaUnifier().union(rawSchemaResults);
          
          const updateData = {
            rawSchemaFinal: JSON.stringify(rawSchemaFinal),
            my_version: my_version,
            batchId: batchId
          };
  
          // Use a função findOneAndUpdate com a opção upsert: true
          this.model.findOneAndUpdate(
            { batchId: batchId },
            { $set: updateData },
            { upsert: true, new: true }
          )
            .then((data) => {
              resolv(data);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };



  union_up = (rawSchemaResults, batchId, my_version): Promise<any> => {
    return new Promise((resolv, reject) => {
      if (!rawSchemaResults || rawSchemaResults.length == 0) {
        throw `no results for batchId: ${batchId}`;
      }
  
      // Recupere o documento existente por batchId
      this.model.findOne({ 'batchId': batchId })
        .then((existingDoc) => {
          // Atualize os campos necessários
  
          //const rawSchemaUnion = this.listEntitiesByBatchId(batchId);
          const rawSchemaUnion = this.listEntitiesByBatchIdMyVersion(batchId, my_version);
          const rawSchemaFinal = new RawSchemaUnifier().union_update(rawSchemaResults, rawSchemaUnion);
          
          const updateData = {
            rawSchemaFinal: JSON.stringify(rawSchemaFinal),
            my_version: my_version,
            batchId: batchId
          };
  
          // Use a função findOneAndUpdate com a opção upsert: true
          this.model.findOneAndUpdate(
            { batchId: batchId },
            { $set: updateData },
            { upsert: true, new: true }
          )
            .then((data) => {
              resolv(data);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}

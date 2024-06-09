import { Batch, MongoClient } from 'mongodb';
import Executor from '../../helpers/rawSchema/executor';
import RawSchemaBatch from '../../models/rawSchema/rawSchemaBatch';
import DatabaseParam from '../../params/databaseParam';
import AlertController from '../alert/alert';
import BaseController from '../base';
import JsonSchemaExtractedController from '../jsonSchema/jsonSchemaExtracted';
import RawSchemaController from './rawSchema';
import RawSchemaOrderedResultController from './rawSchemaOrderedResult';
import RawSchemaUnionController from './rawSchemaUnion';
import RawSchemaUnorderedResultController from './rawSchemaUnorderedResult';
import rawSchemaBatch from '../../models/rawSchema/rawSchemaBatch';


export default class RawSchemaBatchController extends BaseController {

  model = RawSchemaBatch;


  allStepsUpdate = (params): Promise<any> => {
    return new Promise((resolv, reject) => {
      const databaseParam = new DatabaseParam(JSON.parse(JSON.stringify(params)));
      const rawSchemaBatch = new this.model();
     // @ts-ignore
      rawSchemaBatch._id = databaseParam.batchId

      this.model.findOne(rawSchemaBatch._id).then((data) => {
        console.log(`my_version: ${data}`);
        const parsedData = data.my_version;
        rawSchemaBatch.my_version = parsedData + 1
        console.log(`rawSchemaBatch.my_version: ${rawSchemaBatch.my_version}`);
        rawSchemaBatch.collectionName = databaseParam.collectionName;
        rawSchemaBatch.collectionUpdateCount = data.collectionUpdateCount
        console.log(`rawSchemaBatch.collectionUpdateCount ${data.collectionUpdateCount}`)
        
        rawSchemaBatch.dbUri = databaseParam.getURIWithoutAuthentication();
        
        // @ts-ignore
        rawSchemaBatch.userId = databaseParam.userId;
        rawSchemaBatch.startDate = new Date();
        rawSchemaBatch.status = 'CONNECT_DATABASE';
        rawSchemaBatch.rawSchemaFormat = databaseParam.rawSchemaFormat;
        
        this.updateEntity(rawSchemaBatch._id, rawSchemaBatch).then((data) => {
  
          return this.connect(databaseParam);
        }).then((data) => {
          console.log('CONNECT: DONE');
          return this.getCollection_up(data, rawSchemaBatch);
        }).then((data) => {
          console.log('GET COLLECTION: DONE');
          return this.executeStepOne_up(data, rawSchemaBatch);
        }).then((data) => {
          console.log('STEP1: DONE');
          return this.executeStepTwo(rawSchemaBatch);
        }).then((data) => {
          console.log('STEP2: DONE');
          return this.executeStepThree_up(rawSchemaBatch);
        }).then((data) => {
          console.log('STEP3: DONE');
          return this.executeStepFour(rawSchemaBatch);
        }).then((data) => {
          console.log('STEP4: DONE');
          return this.generateAlert(data);
        }).then((data) => {
          console.log('ALERT: DONE');
          return resolv(data);
        }).catch((error) => {
          console.error('STEPS error', error);
          if (rawSchemaBatch) {
            rawSchemaBatch.status = 'ERROR';
            rawSchemaBatch.statusType = error.type;
            rawSchemaBatch.statusMessage = error.message;
            this.updateEntity(rawSchemaBatch._id, rawSchemaBatch).then((data) => {
              return this.generateAlert(rawSchemaBatch);
            }).then((data) => {
              return resolv(data);
            }).catch((error) => {
              return reject(error);
            });
          } else {
            return reject(error);
          }
        });
      })
    });
  };

  

  getVValue = (id) => {
    return new Promise((resolve, reject) => {
      this.model.findOne({ _id: id }, (error, document) => {
        if (error) {
          console.error('Erro ao pesquisar o documento:', error);
          reject(error);
        } else if (!document) {
          console.error(`O documento com o _id ${id} não existe`);
          reject(`O documento com o _id ${id} não existe`);
        } else {
          const vValue = {
            collectionUpdateCount: document.collectionUpdateCount || [], // Valor de collectionUpdateCount, padrão para array vazio se não existir
            my_version: document.my_version // Valor de my_version
          };
          resolve(vValue);
        }
      });
    });
  };
  

  
  public updateEntity = (id, entity): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.findOneAndUpdate({'_id': id}, entity).then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject({'type': 'UPDATE_ENTITY_ERROR', 'message': error.message, 'code': 404});
      });
    });
  };


  allSteps = (params): Promise<any> => {
    return new Promise((resolv, reject) => {

      const databaseParam = new DatabaseParam(JSON.parse(JSON.stringify(params)));
      const rawSchemaBatch = new this.model();
      rawSchemaBatch.collectionName = databaseParam.collectionName;
      rawSchemaBatch.dbUri = databaseParam.getURIWithoutAuthentication();
      // @ts-ignore
      rawSchemaBatch.userId = databaseParam.userId;
      rawSchemaBatch.startDate = new Date();
      rawSchemaBatch.status = 'CONNECT_DATABASE';
      rawSchemaBatch.rawSchemaFormat = databaseParam.rawSchemaFormat;
      rawSchemaBatch.save().then((data) => {
        return this.connect(databaseParam);
      }).then((data) => {
        console.log('CONNECT: DONE');
        return this.getCollection(data, rawSchemaBatch);
      }).then((data) => {
        console.log('GET COLLECTION: DONE');
        return this.executeStepOne(data, rawSchemaBatch);
      }).then((data) => {
        console.log('STEP1: DONE');
        return this.executeStepTwo(rawSchemaBatch);
      }).then((data) => {
        console.log('STEP2: DONE');
        return this.executeStepThree(rawSchemaBatch);
      }).then((data) => {
        console.log('STEP3: DONE');
        return this.executeStepFour(rawSchemaBatch);
      }).then((data) => {
        console.log('STEP4: DONE');
        return this.generateAlert(data);
      }).then((data) => {
        console.log('ALERT: DONE');
        return resolv(data);
      }).catch((error) => {
        console.error('STEPS error', error);
        if (rawSchemaBatch) {
          rawSchemaBatch.status = 'ERROR';
          rawSchemaBatch.statusType = error.type;
          rawSchemaBatch.statusMessage = error.message;
          rawSchemaBatch.save().then((data) => {
            return this.generateAlert(rawSchemaBatch);
          }).then((data) => {
            return resolv(data);
          }).catch((error) => {
            return reject(error);
          });
        } else {
          return reject(error);
        }
      });
    });
  };

  deleteBatch = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.findOneAndRemove({_id: batchId}).then((data) => {
        return new RawSchemaController(batchId).deleteAll();
      }).then((data) => {
        return new RawSchemaOrderedResultController(batchId).deleteAll();
      }).then((data) => {
        return new RawSchemaUnorderedResultController(batchId).deleteAll();
      }).then((data) => {
        return new RawSchemaUnionController().deleteEntitiesByBatchId(batchId);
      }).then((data) => {
        return new JsonSchemaExtractedController().deleteEntitiesByBatchId(batchId);
      }).then((data) => {
        return new AlertController().deleteEntitiesByBatchId(batchId);
      }).then((data) => {
        return resolv(data);
      }).catch((error) => {
        return reject(error);
      });
    });
  };

  discovery = (params): Promise<any> => {
    return new Promise((resolv, reject) => {

      const databaseParam = new DatabaseParam(JSON.parse(JSON.stringify(params)));
      const rawSchemaBatch = new this.model();
      rawSchemaBatch.collectionName = databaseParam.collectionName;
      rawSchemaBatch.dbUri = databaseParam.getURIWithoutAuthentication();
      // @ts-ignore
      rawSchemaBatch.userId = databaseParam.userId;
      rawSchemaBatch.startDate = new Date();

      this.connect(databaseParam).then((data) => {
        return this.getCollection(data, rawSchemaBatch);
      }).then((data) => {
        return this.executeStepOne(data, rawSchemaBatch);
      }).then((data) => {
        return resolv(data);
      }).catch((error) => {
        if (rawSchemaBatch) {
          rawSchemaBatch.status = 'ERROR';
          rawSchemaBatch.statusMessage = error;
          rawSchemaBatch.save();
        } else {
          return reject(error);
        }
      });
    });
  };

  private connect = (databaseParam): Promise<any> => {
    return new Promise((resolv, reject) => {
      MongoClient.connect(databaseParam.getURI(), {connectTimeoutMS: 5000}).then((database) => {
        return resolv(database.db(databaseParam.databaseName));
      }).catch((error) => {
        return reject({'type': 'DATABASE_CONNECTION_ERROR', 'message': error.message, 'code': 400});
      });
    });
  };

  

  private getCollection = (database, rawSchemaBatch): Promise<any> => {
    return new Promise((resolve, reject) => {
      const collection = database.collection(rawSchemaBatch.collectionName);
      collection.count().then((count) => {
        if (count === 0)
          return reject({'type': 'EMPTY_COLLECTION_ERROR', 'message': 'coleção não encontrada', 'code': 400});
  
        rawSchemaBatch.collectionCount = count;
        //rawSchemaBatch.collectionUpdateCount = [count]; // Inicializa o array com o valor atual de 'count'
        rawSchemaBatch.collectionUpdateCount.push(count);
        rawSchemaBatch.status = 'LOADING_DOCUMENTS';
  
        return rawSchemaBatch.save();
      }).then((data) => {
        return resolve(collection);
      }).catch((error) => {
        return reject({'type': 'EMPTY_COLLECTION_ERROR', 'message': 'coleção não encontrada', 'code': 400});
      });
    });
  };


private getCollection_up = (database, rawSchemaBatch): Promise<any> => {
  return new Promise((resolve, reject) => {
    const collection = database.collection(rawSchemaBatch.collectionName);

    collection.count().then((count) => {
      if (count === 0) {
        reject({
          'type': 'EMPTY_COLLECTION_ERROR',
          'message': 'coleção não encontrada',
          'code': 400
        });
      }
      rawSchemaBatch.collectionCount = count;
      rawSchemaBatch.status = 'LOADING_DOCUMENTS';
      // Adiciona o valor de count ao array collectionUpdateCount
      rawSchemaBatch.collectionUpdateCount.push(count);
      // Atualiza a entidade com os novos dados
      return this.updateEntity(rawSchemaBatch._id, rawSchemaBatch);
    }).then((data) => {
      resolve(collection);
    }).catch((error) => {
      reject({
        'type': 'EMPTY_COLLECTION_ERROR',
        'message': 'coleção não encontrada',
        'code': 400
      });
    });
  });
};








  
  private executeStepOne = (collection, rawSchemaBatch): Promise<any> => {
    return new Executor().execute(collection, rawSchemaBatch);
  };

  private executeStepOne_up = (collection, rawSchemaBatch): Promise<any> => {
    return new Executor().execute_up(collection, rawSchemaBatch);
  };

  private executeStepTwo = (rawSchemaBatch) => {
    // return this.mapReduce(rawSchemaBatch._id);
    return this.aggregate(rawSchemaBatch._id);
    // return this.aggregateAndReduce(rawSchemaBatch._id);
  };

  private executeStepTwo_update = (rawSchemaBatch) => {
    return this.aggregate_up(rawSchemaBatch._id);
  };

  private executeStepThree = (rawSchemaBatch) => {
    return new RawSchemaOrderedResultController(rawSchemaBatch._id).union(rawSchemaBatch._id);
  };

  private executeStepThree_up = (rawSchemaBatch) => {
    return new RawSchemaOrderedResultController(rawSchemaBatch._id).union_up(rawSchemaBatch._id);
  };

  private executeStepFour = (rawSchemaBatch) => {
    return new JsonSchemaExtractedController().generate(rawSchemaBatch._id);
  };

  private generateAlert = (rawSchemaBatch) => {
    return new AlertController().generate(rawSchemaBatch);
  };

  mapReduce = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      let rawSchemaBatch;
      this.getById(batchId).then((rawSchemaBatchResult) => {
        if (!rawSchemaBatchResult)
          return reject({'message': `rawSchemaBatch with id: ${batchId} not found`, 'code': 404});
        return rawSchemaBatchResult;
      }).then((data) => {
        rawSchemaBatch = data;
        rawSchemaBatch.reduceType = 'MAP_REDUCE';
        rawSchemaBatch.unorderedMapReduceDate = null;
        rawSchemaBatch.orderedMapReduceDate = null;
        rawSchemaBatch.unorderedAggregationDate = null;
        rawSchemaBatch.orderedAggregationDate = null;
        return new RawSchemaController(batchId).mapReduce(batchId);
      }).then((data) => {
        console.log('STEP2.1: DONE');
        new RawSchemaUnorderedResultController(batchId).countAllEntities().then((data) => {
          rawSchemaBatch.uniqueUnorderedCount = data;
          rawSchemaBatch.unorderedMapReduceDate = new Date();
          return rawSchemaBatch.save();
        }).catch((error) => {
          console.log('error', error);
        });
        return new RawSchemaUnorderedResultController(batchId).mapReduce(batchId);
      }).then((data) => {
        console.log('STEP2.2: DONE');
        new RawSchemaOrderedResultController(batchId).countAllEntities().then((data) => {
          rawSchemaBatch.uniqueOrderedCount = data;
          rawSchemaBatch.status = 'UNION_DOCUMENTS';
          rawSchemaBatch.orderedMapReduceDate = new Date();
          return rawSchemaBatch.save();
        }).catch((error) => {
          console.log('error', error);
        });
        return resolv(data);
      }).catch((error) => {
        return reject({'type': 'REDUCE_DOCUMENTS_ERROR', 'message': error.message, 'code': 400});
      });
    });
  };

  aggregate = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      let rawSchemaBatch;
      this.getById(batchId).then((rawSchemaBatchResult) => {
        if (!rawSchemaBatchResult)
          return reject({'message': `rawSchemaBatch with id: ${batchId} not found`, 'code': 404});
        return rawSchemaBatchResult;
      }).then((data) => {
        rawSchemaBatch = data;
        rawSchemaBatch.reduceType = 'AGGREGATE';
        rawSchemaBatch.unorderedMapReduceDate = null;
        rawSchemaBatch.orderedMapReduceDate = null;
        rawSchemaBatch.unorderedAggregationDate = null;
        rawSchemaBatch.orderedAggregationDate = null;
        return new RawSchemaController(batchId).aggregate(batchId);
      }).then((data) => {
        console.log('STEP2.1: DONE');
        new RawSchemaUnorderedResultController(batchId).countAllEntities().then((data) => {
          rawSchemaBatch.uniqueUnorderedCount = data;
          rawSchemaBatch.unorderedAggregationDate = new Date();
          return rawSchemaBatch.save();
        }).catch((error) => {
          console.log('error', error);
        });
        return new RawSchemaUnorderedResultController(batchId).aggregate(batchId);
      }).then((data) => {
        console.log('STEP2.2: DONE');
        new RawSchemaOrderedResultController(batchId).countAllEntities().then((data) => {
          rawSchemaBatch.uniqueOrderedCount = data;
          rawSchemaBatch.status = 'UNION_DOCUMENTS';
          rawSchemaBatch.orderedAggregationDate = new Date();
          return rawSchemaBatch.save();
        }).catch((error) => {
          console.log('error', error);
        });
        return resolv(data);
      }).catch((error) => {
        return reject({'type': 'REDUCE_DOCUMENTS_ERROR', 'message': error.message, 'code': 400});
      });
    });
  };

  aggregate_up = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      let rawSchemaBatch;
      this.getById(batchId).then((rawSchemaBatchResult) => {
        if (!rawSchemaBatchResult)
          return reject({'message': `rawSchemaBatch with id: ${batchId} not found`, 'code': 404});
        return rawSchemaBatchResult;
      }).then((data) => {
        rawSchemaBatch = data;
        rawSchemaBatch.reduceType = 'AGGREGATE';
        rawSchemaBatch.unorderedMapReduceDate = null;
        rawSchemaBatch.orderedMapReduceDate = null;
        rawSchemaBatch.unorderedAggregationDate = null;
        rawSchemaBatch.orderedAggregationDate = null;
        return new RawSchemaController(batchId).aggregate(batchId);
      }).then((data) => {
        console.log('STEP2.1: DONE');
        new RawSchemaUnorderedResultController(batchId).countAllEntities().then((data) => {
          rawSchemaBatch.uniqueUnorderedCount = data;
          rawSchemaBatch.unorderedAggregationDate = new Date();
          return this.updateEntity(rawSchemaBatch._id, rawSchemaBatch);
        }).catch((error) => {
          console.log('error', error);
        });
        return new RawSchemaUnorderedResultController(batchId).aggregate(batchId);
      }).then((data) => {
        console.log('STEP2.2: DONE');
        new RawSchemaOrderedResultController(batchId).countAllEntities().then((data) => {
          rawSchemaBatch.uniqueOrderedCount = data;
          rawSchemaBatch.status = 'UNION_DOCUMENTS';
          rawSchemaBatch.orderedAggregationDate = new Date();
          return this.updateEntity(rawSchemaBatch._id, rawSchemaBatch);
        }).catch((error) => {
          console.log('error', error);
        });
        return resolv(data);
      }).catch((error) => {
        return reject({'type': 'REDUCE_DOCUMENTS_ERROR', 'message': error.message, 'code': 400});
      });
    });
  };

  aggregateAndReduce = (batchId): Promise<any> => {
    return new Promise((resolv, reject) => {
      let rawSchemaBatch;
      this.getById(batchId).then((rawSchemaBatchResult) => {
        if (!rawSchemaBatchResult)
          return reject({'message': `rawSchemaBatch with id: ${batchId} not found`, 'code': 404});
        return rawSchemaBatchResult;
      }).then((data) => {
        rawSchemaBatch = data;
        rawSchemaBatch.reduceType = 'AGGREGATE_AND_MAP_REDUCE';
        rawSchemaBatch.unorderedMapReduceDate = null;
        rawSchemaBatch.orderedMapReduceDate = null;
        rawSchemaBatch.unorderedAggregationDate = null;
        rawSchemaBatch.orderedAggregationDate = null;
        return new RawSchemaController(batchId).aggregate(batchId);
      }).then((data) => {
        console.log('STEP2.1: DONE');
        new RawSchemaUnorderedResultController(batchId).countAllEntities().then((data) => {
          rawSchemaBatch.uniqueUnorderedCount = data;
          rawSchemaBatch.unorderedAggregationDate = new Date();
          return rawSchemaBatch.save();
        }).catch((error) => {
          console.log('error', error);
        });
        return new RawSchemaUnorderedResultController(batchId).mapReduce(batchId);
      }).then((data) => {
        console.log('STEP2.2: DONE');
        new RawSchemaOrderedResultController(batchId).countAllEntities().then((data) => {
          rawSchemaBatch.uniqueOrderedCount = data;
          rawSchemaBatch.status = 'UNION_DOCUMENTS';
          rawSchemaBatch.orderedMapReduceDate = new Date();
          return rawSchemaBatch.save();
        }).catch((error) => {
          console.log('error', error);
        });
        return resolv(rawSchemaBatch);
      }).catch((error) => {
        return reject({'type': 'REDUCE_DOCUMENTS_ERROR', 'message': error.message, 'code': 400});
      });
    });
  };

  getById = (id) => {
    return this.model.findById(id);
  };

  listByUserId = (userId) => {
    return this.model.find({'userId': userId});
  };

}

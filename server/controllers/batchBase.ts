import BaseController from './base';

abstract class BatchBaseController extends BaseController {

  listByBatchId = (req, res) => {
    this.listEntitiesByBatchId(req.params.id).then((data) => {
      return this.success(res, data);
    }, (error) => {
      return this.error(res, error, 404);
    });
  };

  deleteByBatchId = (req, res) => {
    this.deleteEntitiesByBatchId(req.params.id).then((data) => {
      return this.success(res, 'DELETED');
    }, (error) => {
      return this.error(res, error, 404);
    });
  };

  countByBatchId = (req, res) => {
    this.countEntitiesByBatchId(req.params.id).then((data) => {
      return this.success(res, data);
    }, (error) => {
      return this.error(res, error, 404);
    });
  };

  listEntitiesByBatchId = (batchId) => {
    return this.model.find({'batchId': batchId});
  };

  listEntitiesByBatchIdMyVersion = (batchId, my_version) => {
    return this.model.find({'batchId': batchId, 'my_version': my_version});
  };

  deleteEntitiesByBatchId = (batchId) => {
    return this.model.remove({'batchId': batchId});
  };

  countEntitiesByBatchId = (batchId) => {
    return this.model.find({'batchId': batchId}).count();
  };

}

export default BatchBaseController;

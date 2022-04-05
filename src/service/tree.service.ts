import { ApiServiceName } from "../model/common.model";
import { RequestCreateTree, RequestDeleteTree, RequestUpdateSeqTree, RequestUpdateTree, TreeSearchCondition } from "../model/tree.model";
import CommonService from "./common.service";

export default class TreeService extends CommonService {

  async insertTree<T>(request: RequestCreateTree): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'POST', `/tree`, null, request);
    return response.status === 200 ? response.data : null;
  }

  async retrieveTree<T>(searchCondition: TreeSearchCondition): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'GET', `/tree`, searchCondition, null);
    return response.status === 200 ? response.data : null;
  }

  async updateTree<T>(request: RequestUpdateTree): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'PUT', `/tree/${request.id}`, null, request);
    return response.status === 200 ? response.data : null;
  }

  async deleteTree<T>(request: RequestDeleteTree): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'DELETE', `/tree/${request.id}`, null, request);
    return response.status === 200 ? response.data : null;
  }

  async updateSeqTree<T>(request: RequestUpdateSeqTree): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'PUT', `/tree/${request.id}/seq`, null, request);
    return response.status === 200 ? response.data : null;
  }

  async uploadFile<T>(request: any): Promise<T> {
    const response = await this.callApiForUpload(ApiServiceName.MK2, 'POST', `/upload`, null, request);
    return response.status === 200 ? response.data : null;
  }
}
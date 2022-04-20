import {
  RequestCreateIssue,
  RequestUpdateIssueName,
  RequestUpdateIssueUseTime,
  RequestUpdateIssueState,
  RequestDeleteIssue,
} from '../model/issue.model';
import CommonService from "./common.service";
import { ApiServiceName } from '../model/common.model'
import { RequestCreateIssueCheck, RequestUpdateIssueCheckCompleteYn, RequestUpdateIssueCheckName } from '../model/issueCheck.model';

export default class KanbanService extends CommonService {
  async insertIssue<T>(request: RequestCreateIssue): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'POST', `/issue`, null, request);
    return response.status === 200 ? response.data : null;
  }

  async retrieveIssue<T>(): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'GET', `/issue`, null, null);
    return response.status === 200 ? response.data : null;
  }

  async updateIssueName<T>(request: RequestUpdateIssueName): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'PUT', `/issue/${request.issueId}`, null, request);
    return response.status === 200 ? response.data : null;
  }

  async updateUseTime<T>(request: RequestUpdateIssueUseTime): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'PUT', `/issue/${request.issueId}/useTime`, null, null);
    return response.status === 200 ? response.data : null;
  }

  async updateState<T>(request: RequestUpdateIssueState): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'PUT', `/issue/${request.issueId}/state/${request.issueState}`, null, null);
    return response.status === 200 ? response.data : null;
  }

  async deleteIssue<T>(request: RequestDeleteIssue): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'DELETE', `/issue/${request.issueId}`, null, null);
    return response.status === 200 ? response.data : null;
  }

  async updateIssueCheckCompleteYn<T>(request: RequestUpdateIssueCheckCompleteYn): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'PUT', `/issue/${request.issueId}/issueCheck/${request.checkId}/completeYn`, null, request);
    return response.status === 200 ? response.data : null;
  }

  async insertIssueCheck<T>(request: RequestCreateIssueCheck): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'POST', `/issue/${request.issueId}/issueCheck`, null, request);
    return response.status === 200 ? response.data : null;
  }

  async updateIssueCheckName<T>(request: RequestUpdateIssueCheckName): Promise<T> {
    const response = await this.callApi(ApiServiceName.MK2, 'PUT', `/issue/${request.issueId}/issueCheck/${request.checkId}`, null, request);
    return response.status === 200 ? response.data : null;
  }
}
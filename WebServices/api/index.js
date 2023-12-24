import ApiManager from '@tradesoft/war-common/ApiManager';
import filterEmpty from '../utils/filterEmpty';

export default class Api {
  /** @type {ApiManager} */
  manager;

  /** @type {Api} */
  static instance;

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  getManager() {
    if (!this.manager) {
      this.manager = new ApiManager();
    }

    return this.manager;
  }

  getProviders() {
    return this.getManager().get('webservice/provider/');
  }

  getProviderStatistics(id) {
    return this.getManager().get(`webservice/provider/${id}/statistics/`);
  }

  getSettings() {
    return this.getManager().get('webservice/settings/');
  }

  postSettings(data) {
    return this.getManager().post('webservice/settings/', data);
  }

  getWebOrder() {
    return this.getManager().get('webservice/weborder/');
  }

  postWebOrder(data) {
    return this.getManager().post('webservice/weborder/', data);
  }

  getWebInfo() {
    return this.getManager().get('webservice/partinfo/');
  }

  getWebInfoLanguages() {
    return this.getManager().get('webservice/info/languages/');
  }

  postWebInfo(data) {
    return this.getManager().post('webservice/partinfo/', data);
  }

  getWebAnalogs() {
    return this.getManager().get('webservice/analogs/');
  }

  postWebAnalogs(data) {
    return this.getManager().post('webservice/analogs/', data);
  }

  getLogs(filters = {}) {
    const notEmptyFilters = filterEmpty(filters);
    const searchParams = new URLSearchParams(notEmptyFilters).toString();

    return this.getManager().get(`webservice/logs/?${searchParams}`);
  }

  getLogInfo(logId) {
    return this.getManager().get(`webservice/logs/${logId}/`);
  }

  getWebAnalogsFilterConfig() {
    return this.getManager().get('webservice/analogs/test/filter-config/');
  }

  getTestingWebAnalogsByCode({ code, showSynonyms = false }) {
    const searchParams = new URLSearchParams({ showSynonyms: Number(showSynonyms) }).toString();

    return this.getManager().get(`webservice/analogs/test/search/${code}/?${searchParams}`);
  }

  getTestingWebAnalogsByProducer({ code, producer, showSynonyms = false }) {
    const searchParams = new URLSearchParams({ showSynonyms: Number(showSynonyms) }).toString();

    return this.getManager().get(`webservice/analogs/test/search/${code}/${producer}/?${searchParams}`);
  }

  getProviderConnections(providerName) {
    return this.getManager().get(`webservice/provider/${providerName}/`);
  }

  deleteProviderConnection(formData) {
    return this.getManager().delete('webservice/provider/delete-connection/', formData);
  }

  changeProviderConnectionVisibility({ providerId, connectionId }, formData) {
    return this.getManager().post(`webservice/provider/change-visibility/${providerId}/${connectionId}/`, formData);
  }

  copyProviderConnection({ providerId, connectionId }) {
    return this.getManager().post(`webservice/provider/copy/${providerId}/${connectionId}/`);
  }

  getProviderTab({ tabName, providerName, datafileId }) {
    return this.getManager().get(`webservice/provider/tab-${tabName}/${providerName}/${datafileId}/`);
  }

  postProviderTab({ tabName, providerName, datafileId }, formData) {
    return this.getManager().post(`webservice/provider/tab-${tabName}/${providerName}/${datafileId}/`, formData);
  }

  testProviderConnection(providerName, urlParams) {
    const searchParams = new URLSearchParams(urlParams);
    return this.getManager().get(
      `webservice/provider/${providerName}/test/?${searchParams.toString()}`,
    );
  }

  getUsedPartsInfo({ providerName, producerCode }) {
    return this.getManager().get(
      `webservice/provider/${providerName}/used-data/${producerCode}/`,
    );
  }

  getNewProvider() {
    return this.getManager().get('webservice/add-provider/');
  }

  postNewProvider(formData) {
    return this.getManager().post('webservice/add-provider/', formData);
  }

  getNewAccountProviderConnection(providerName) {
    return this.getManager().get(`webservice/provider/tab-account/${providerName}/`);
  }

  postNewAccountProviderConnection(providerName, formData) {
    return this.getManager().post(`webservice/provider/tab-account/${providerName}/`, formData);
  }

  getExcludedProviderTabs(providerName) {
    return this.getManager().get(`webservice/provider/${providerName}/excluded-tabs-list/`);
  }
}

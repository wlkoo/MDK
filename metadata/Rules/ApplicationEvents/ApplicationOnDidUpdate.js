import Logger from '../Log/Logger';

export default function ApplicationOnDidUpdate(clientAPI) {
    Logger.init(clientAPI);
    // return clientAPI.executeAction('/SAPAssetManager/Actions/OData/InitializeOfflineOData.action').then((success) => {
    //   return Promise.resolve(success);
    // }).catch((failure) => {
    //   Logger.error('AppOnDidUpdateFailure', failure);
    //   return Promise.reject(clientAPI.localizeText('offline_odata_initialization_failed'));
    // });
    let initializeSAMOData = clientAPI.executeAction('/SAPAssetManager/Actions/OData/InitializeOfflineOData.action');
    let initializeFormioOData = clientAPI.executeAction('/SAPAssetManager/Actions/OData/InitializeFormioOData.action');
    return Promise.all([initializeSAMOData, initializeFormioOData]).then((success) => {
      return Promise.resolve(success);
    }).catch((failure) => {
      Logger.error('AppOnDidUpdateFailure', failure);
      return Promise.reject(clientAPI.localizeText('offline_odata_initialization_failed'));
    });
}

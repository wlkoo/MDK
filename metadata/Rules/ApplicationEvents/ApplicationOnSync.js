import DeleteUnusedOverviewEntities from '../Confirmations/Init/DeleteUnusedOverviewEntities';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import isSyncInProgress from '../Sync/IsSyncInProgress';
import { FormioLibrary as libFormio } from '../Extensions/Formio/FormioLibrary';

export default function ApplicationOnSync(clientAPI) {
    if (!isSyncInProgress(clientAPI)) {
        return clientAPI.executeAction('/SAPAssetManager/Actions/SyncIntializeMessage.action').then(() => {
            setSyncInProgressState(clientAPI, true);
            let uploadSAMOData = clientAPI.executeAction('/SAPAssetManager/Actions/OData/UploadOfflineData.action');
            let uploadFormioOData = clientAPI.executeAction('/SAPAssetManager/Actions/OData/UploadFormioOfflineData.action');
            
            return DeleteUnusedOverviewEntities(clientAPI).then( ()=> {
                return Promise.all([uploadSAMOData, uploadFormioOData]).then((success) => {
                    // libFormio.syncFormio(clientAPI);
                    return Promise.resolve(success);
                  });
            });
        });
    } else {
        return clientAPI.executeAction('/SAPAssetManager/Actions/SyncInProgress.action');
    }
}

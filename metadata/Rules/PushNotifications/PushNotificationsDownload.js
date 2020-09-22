import Logger from '../Log/Logger';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
export default function PushNotificationsDownload(context,ObjectType) {
    if (ObjectType === 'WorkOrder') {
        return context.executeAction('/SAPAssetManager/Actions/PushNotifications/PushNotificationsDownloadInProgress.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/PushNotifications/PushNotificationsWorkOrderDownload.action');
        });
    } else {
        // If there are errors, set the sync in progress to false
        setSyncInProgressState(context, false);
        Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPushNotification.global').getValue() , 'Push is not implemented for ' + ObjectType + ' entity set');
    }
   
}

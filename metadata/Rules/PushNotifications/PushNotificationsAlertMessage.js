import libCom from '../Common/Library/CommonLibrary';
import downloadPush from './PushNotificationsDownload';
import setStateVariables from './PushNotificationsStateVariables';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import isSyncInProgress from '../Sync/IsSyncInProgress';
import setPendingPushState from './SetPushNotificationsPendingState';
import isAndroid from '../Common/IsAndroid';
import getUnifiedKey from './PushNotificationPayloadKeys';
import libVal from '../Common/Library/ValidationLibrary';

export default function PushNotificationsAlertMessage(context, appEventData) {
    // clear badge number
    context.setApplicationIconBadgeNumber(0);
    let unifiedPayload;
    if (isAndroid(context)) {
        if (libVal.evalIsEmpty(appEventData.payload.notification)) {
            // When we receive push while the app is in background, the notification property
            // is empty so we have to use alert property which has the key-value pair similar
            // to iOS.
            libCom.setStateVariable(context,'AndroidBackgroundPush',true);
            unifiedPayload = JSON.parse(appEventData.payload.data.alert);
        } else {
            unifiedPayload = appEventData.payload.notification;
            libCom.setStateVariable(context,'AndroidBackgroundPush',false);
        }
    } else {
        unifiedPayload = appEventData.payload.aps.alert;
    }

    return libCom.showWarningDialog(context, context.localizeText(unifiedPayload[getUnifiedKey(context, 'localizedBody')]), context.localizeText(unifiedPayload[getUnifiedKey(context,'localizedTitle')],unifiedPayload[getUnifiedKey(context,'localizeTitleArguments')]), context.localizeText('download'), context.localizeText('later')).then((result) => {
        // store the payload in state variable so that it can be accessed later
        setStateVariables(context, appEventData, unifiedPayload);
        if (result === true) {
            // if sync is not already in progress
            if (!isSyncInProgress(context)) {
                setSyncInProgressState(context, true);
                downloadPush(context, appEventData.data.ObjectType);
            } else {
                setPendingPushState(context, true);
                return context.executeAction('/SAPAssetManager/Actions/SyncInProgressWhilePush.action');
            }
        }
        return '';
    });   
       
}

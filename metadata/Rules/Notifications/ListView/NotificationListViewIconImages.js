import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../Common/IsAndroid';
export default function NotificationListViewIconImages(context) {
    var iconImage = [];
    // check if this Notification has any docs
    let docs = context.binding.NotifDocuments;
    if (docs && docs.length > 0) {
        if (isAndroid(context)) {
            iconImage.push('/SAPAssetManager/Images/attachmentStepIcon.android.png');
        } else {
            iconImage.push('/SAPAssetManager/Images/attachmentStepIcon.png');
        }
    }
    // check if this Notification has been locally created
    if (libCommon.getTargetPathValue(context,'#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:MobileStatus/#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:HeaderLongText/#Property:0/#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }
    return iconImage;
}


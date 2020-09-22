import common from '../Common/Library/CommonLibrary';

export default function FunctionalLocationDetailsNav(context) {

    let floc = context.getPageProxy().binding.FunctionalLocation;

    if (floc && floc['@odata.readLink']) {
        return common.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationDetailsNav.action', floc['@odata.readLink'], '$expand=WorkOrderHeader');
    } else {
        return null;
    }
}

import DocLib from '../DocumentLibrary';

export default function DocumentCreateObjectKeyForHeader(controlProxy) {
    let value = controlProxy.binding['@odata.readLink'];
    switch (DocLib.getParentObjectType(controlProxy)) {
        case DocLib.ParentObjectType.WorkOrder:
            value += ':OrderId';
            break;
        case DocLib.ParentObjectType.Notification:
            value += ':NotificationNumber';
            break;
        case DocLib.ParentObjectType.Equipment:
            value += ':EquipId';
            break;
        case DocLib.ParentObjectType.FunctionalLocation:
            value += ':FuncLocIdIntern';
            break;
        default:
            break;
    }
    return '<' + value + '>';
}

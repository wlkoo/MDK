import NotificationItemCauseUpdateNav from '../Notifications/Item/Cause/NotificationItemCauseUpdateNav';
import WorkOrderUpdateNav from '../WorkOrders/WorkOrderUpdateNav';
import WorkOrderOperationUpdateNav from '../WorkOrders/Operations/WorkOrderOperationUpdateNav';
import NotificationUpdateNav from '../Notifications/NotificationUpdateNav';
import NotificationItemUpdateNav from '../Notifications/Item/NotificationItemUpdateNav';
import NotificationTaskUpdateNav from '../Notifications/Task/NotificationTaskUpdateNav';
import NotificationActivityUpdateNav from '../Notifications/Activity/CreateUpdate/NotificationActivityUpdateNav';
import NotificationItemTaskUpdateNav from '../Notifications/Item/Task/NotificationItemTaskUpdateNav';
import NotificationItemActivityUpdateNav from '../Notifications/Item/Activity/NotificationItemActivityUpdateNav';
import { NoteLibrary as NoteLib, TransactionNoteType} from '../Notes/NoteLibrary';
import SubOperationUpdateNav from '../SubOperations/SubOperationUpdateNav';
import MeasurementDocumentUpdateNav from '../Measurements/Document/MeasurementDocumentUpdateNav';
import Logger from '../Log/Logger';
import PartIssueUpdateNav from '../Parts/Issue/PartIssueUpdateNav';
import PartIssueFromRelatedItemUpdateNav from '../Parts/Issue/PartIssueFromRelatedItemUpdateNav';
import ConfirmationUpdateNav from '../Confirmations/CreateUpdate/ConfirmationUpdateNav';
import PRTEquipmentUpdateNav from '../WorkOrders/Operations/PRT/PRTEquipmentUpdateNav';
import EquipmentUpdateNav from '../Equipment/EquipmentUpdateNav';
import libValid from '../Common/Library/ValidationLibrary';

let ErrorMap = {
    MyWorkOrderHeaders: {
        Action: WorkOrderUpdateNav,
    },
    MyWorkOrderComponents: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/Parts/NavToPartCreateSummary.action');
        },
    },
    MyWorkOrderOperations: {
        Action: WorkOrderOperationUpdateNav,
    },
    MyWorkOrderSubOperations: {
        Action: SubOperationUpdateNav,
    },
    MyNotificationHeaders: {
        Action: NotificationUpdateNav,
    },
    MyNotificationItems: {
        Action: NotificationItemUpdateNav,
    },
    MyNotificationTasks: {
        Action: NotificationTaskUpdateNav,
    },
    MyNotificationActivities: {
        Action: NotificationActivityUpdateNav,
    },
    MyNotificationItemCauses: {
        Action: NotificationItemCauseUpdateNav,
    },
    MyNotificationItemTasks: {
        Action: NotificationItemTaskUpdateNav,
    },
    MyNotificationItemActivities: {
        Action: NotificationItemActivityUpdateNav,
    },
    MyWorkOrderHeaderLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrder());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyWorkOrderOperationLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderOperation());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyWorkOrderSubOpLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderSubOperation());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyWorkOrderComponentLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.part());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifHeaderLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notification());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItem());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifTaskLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationTask());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifActivityLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationActivity());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemCauseLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItemCause());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemTaskLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItemTask());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemActivityLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItemActivity());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MeasurementDocuments: {
        Action: MeasurementDocumentUpdateNav,
    },
    WorkOrderTransfers: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderTransferNav.action');
        },
    },
    MaterialDocuments: {
        Action: PartIssueUpdateNav,
    },
    RelatedItem: {
        Action: PartIssueFromRelatedItemUpdateNav,
    },
    UserPreferences: {
        Action: function() {},
    },
    CatsTimesheets: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryEditNav.action');
        },
    },
    CatsTimesheetTexts: {
        Action: function() {},
    },
    Confirmations: {
        Action: ConfirmationUpdateNav,
    },
    MyWorkOrderTool: {
        Action: PRTEquipmentUpdateNav,
    },
    MyEquipments: {
        Action: EquipmentUpdateNav,
    },
};

export default function ErrorArchiveAffectedEntityNav(context) {
    let errorObject = context.binding.ErrorObject;
    context.getClientData().FromErrorArchive = true;

    let entity = getTargetEntity(errorObject.RequestURL);
    if (ErrorMap[entity]) {
        return ErrorMap[entity].Action(context);
    } else if (ErrorMap[entity.substring(0, entity.indexOf('('))]) {
        return ErrorMap[entity.substring(0, entity.indexOf('('))].Action(context);
    } else {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryErrorArchive.global').getValue(),'ErrorArchiveAffectedEntityNav: Unknown entity');
    }
}

/**
 * return the target entity from the url
 * @param {*} requestURL the request url, for example "MyWorkOrderHeaders('4002672')/Confirmations"
 */
function getTargetEntity(requestURL) {
    let entityNames = requestURL.split('/');
    let entity = '';
    for (let i=entityNames.length-1; i>=0; i--) {
        if (!libValid.evalIsEmpty(entityNames[i])) {
            entity = entityNames[i];
            break;
        }
    }

    return entity;
}

export function getErrorArchiveMap() {
    return ErrorMap;
}

import libVal from '../Common/Library/ValidationLibrary';
import {NoteLibrary as NoteLib} from './NoteLibrary';
import WorkOrderCompleted from '../WorkOrders/Details/WorkOrderDetailsOnPageLoad';
import NotificationCompleted from '../Notifications/Details/NotificationDetailsOnPageLoad';
import libCommon from '../Common/Library/CommonLibrary';

export default function NotesViewOnPageLoad(context) {
    // Types of Entity which will have Note Objects 
    const notification = 'MyNotification';
    const myWorkOrderComponent = 'MyWorkOrderComponent';

    const entityName = context.binding['@odata.type'].split('.')[1];
    // For Notification
    if (entityName.includes(notification)) {
         // If completed, all the action items are already hidden
        return NotificationCompleted(context).then((isCompleted) => {
            if (!isCompleted) {
                return NoteLib.noteDownload(context).then(note => {
                    // We need to check IF we have a note and IF that note has a new string
                    if (libVal.evalIsEmpty(note) || libVal.evalIsEmpty(note.NewTextString)) {
                        context.setActionBarItemVisible(1, false);
                    }
                });
            }
            return '';
        });
    } else if (entityName === myWorkOrderComponent) {
        //For local parts, we cannot add or edit note.
        let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
        if (libCommon.isCurrentReadLinkLocal(currentReadLink)) {
            context.setActionBarItemVisible(1, false);
            context.setActionBarItemVisible(0, false);
        }
    } else {
        // If completed, all the action items are already hidden
        return WorkOrderCompleted(context).then((isCompleted) => {
            if (!isCompleted) {
                return NoteLib.noteDownload(context).then(note => {
                // We need to check IF we have a note and IF that note has a new string
                    if (libVal.evalIsEmpty(note) || libVal.evalIsEmpty(note.NewTextString)) {
                        context.setActionBarItemVisible(1, false);
                    }
                });
            }
            return '';
        });
    }
}

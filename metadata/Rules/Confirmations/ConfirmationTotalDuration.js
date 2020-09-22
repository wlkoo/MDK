
import QueryBuilder from '../Common/Query/QueryBuilder';
import FetchRequest from '../Common/Query/FetchRequest';
import ODataDate from '../Common/Date/ODataDate';
import ConfirmationDurationFromTime from './ConfirmationDurationFromTime';
import ConvertMinutesToHourString from './ConvertMinutesToHourString';

export default function ConfirmationTotalDuration(context, passedDate = undefined, doFormat=true) {

    let queryBuilder = new QueryBuilder();
    let orderId;
    switch (getPageName(context)) {
        case 'ConfirmationsListViewPage':
            // Get work order directly from the context object
            orderId = context.getBindingObject().OrderId;
            queryBuilder.addFilter(`OrderID eq '${orderId}'`);
            break;
        case 'WorkOrderConfirmations':
        case 'WorkOrderConfirmationsForDate':
            // Get the work order from the page proxy context
            orderId = context.getPageProxy().getBindingObject().OrderId;
            queryBuilder.addFilter(`OrderID eq '${orderId}'`);
            break;
        default:
            break;
    }

    // If we can find a date, 
    let date = passedDate === undefined ? getAssociatedDate(context) : passedDate;
    if (date !== undefined) {

        let odataDate;

        if (date instanceof ODataDate) {
            odataDate = date;
        } else {
            odataDate = new ODataDate(date);
        }

        queryBuilder.addFilter(`PostingDate eq ${odataDate.queryString(context, 'date')}`);
    }


    let fetchRequest = new FetchRequest('Confirmations', queryBuilder.build());

    return fetchRequest.execute(context).then(result => {
        return formattedDuration(result, doFormat);
    });    
}


function formattedDuration(confirmations, doFormat) {
    let totalDuration = calculateDuration(confirmations);
    if (doFormat) {
        return ConvertMinutesToHourString(totalDuration);
    }
    return totalDuration;
}

function calculateDuration(confirmations) {
    let totalDuration = 0.0;
    if (confirmations !== undefined) {
        confirmations.forEach(conf => {
            totalDuration += ConfirmationDurationFromTime(conf);
        });
    }
    return totalDuration;
}

function getPageName(context) {
    return context.getPageProxy()._page._definition.getName();
}

function getAssociatedDate(context) {
    // Get the page name so we know where to look for the date
    let date;
    switch (getPageName(context)) {
        case 'ConfirmationsOverviewListView':
            // These pages should have PostingDate directly in the bindingObject
            date = context.getBindingObject().PostingDate;
            break;
        case 'ConfirmationsListViewPage':
            // Overview entity will be in the page binding
            date = context.getPageProxy().getBindingObject().PostingDate;
            break;
        case 'WorkOrderConfirmations':
            date = context.evaluateTargetPath('#Page:-Previous/#ClientData').PostingDate;
            break;
        case 'WorkOrderConfirmationsForDate':
            date = context.getPageProxy().evaluateTargetPath('#Page:-Previous/#ClientData').PostingDate;
            break;
        default:
            break;
    }
    return date;
}

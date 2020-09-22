import libCommon from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import QueryBuilder from '../../../Common/Query/QueryBuilder';
import minutesDefault from './TimeSheetEntryMinuteInterval';
import minutesDefaultDecimal from './TimeSheetEntryMinuteIntervalDecimal';

export default function TimeSheetEntryCreateUpdateOnPageLoadForWO(context) {
    let title = context.localizeText('add_time');
    context.setCaption(title);
    var startDate = libCommon.getStateVariable(context, 'StatusStartDate');
    var endDate = libCommon.getStateVariable(context, 'StatusEndDate');
    let durationControl = context.getControl('FormCellContainer').getControl('DurationPkr');
    var elapsed = (endDate - startDate) / 3600000.0;
    // small number to determine if enough time has passed to set control
    var epsilon = 1 / 7200;
    // Time interval to be used in Duration picker.
    // Set duration to time rounded to closest interval in minutes expressed in Hours
    let interval = minutesDefault(context);
    const defaultDecimal = minutesDefaultDecimal(context);
    if (elapsed > epsilon) {
        elapsed = (interval / 60) * (Math.round(60 * elapsed/interval));
        if (elapsed > defaultDecimal) {
            durationControl.setValue(elapsed);
        } else {
            durationControl.setValue(defaultDecimal);
        }
    }

    let woControl = context.getControl('FormCellContainer').getControl('RecOrderLstPkr');
    let oprControl = context.getControl('FormCellContainer').getControl('OperationLstPkr');
    let subOprControl = context.getControl('FormCellContainer').getControl('SubOperationLstPkr');
    let workCenterControl = context.getControl('FormCellContainer').getControl('WorkCenterLstPkr');

    let objects = getContextObjects(context);

    setListPickerValue(workCenterControl, objects.workCenter);
    setListPickerValue(woControl, objects.woReadLink);
    setListPickerValue(oprControl, objects.opReadLink);
    setListPickerValue(subOprControl, objects.subOpReadLink);

    let activityTypeControl = context.getControl('FormCellContainer').getControl('ActivityTypeLstPkr');
    let specifier = activityTypeControl.getTargetSpecifier();
    let binding = context.getBindingObject();
    let queryBuilder = new QueryBuilder();
    let odataType = binding['@odata.type'];
    if (odataType === '#sap_mobile.MyWorkOrderHeader') {
        if (!libVal.evalIsEmpty(binding.CostCenter)) {
            queryBuilder.addFilter(`CostCenter eq '${binding.CostCenter}'`);
        }
        if (!libVal.evalIsEmpty(binding.ControllingArea)) {
            queryBuilder.addFilter(`ControllingArea eq '${binding.ControllingArea}'`);
        }
    } else if (odataType === '#sap_mobile.MyWorkOrderOperation') {
        if (!libVal.evalIsEmpty(binding.WOHeader.CostCenter)) {
            queryBuilder.addFilter(`CostCenter eq '${binding.WOHeader.CostCenter}'`);
        }
        if (!libVal.evalIsEmpty(binding.WOHeader.ControllingArea)) {
            queryBuilder.addFilter(`ControllingArea eq '${binding.WOHeader.ControllingArea}'`);
        }
    } else if (odataType === '#sap_mobile.MyWorkOrderSubOperation') {
        if (!libVal.evalIsEmpty(binding.WorkOrderOperation.WOHeader.CostCenter)) {
            queryBuilder.addFilter(`CostCenter eq '${binding.WorkOrderOperation.WOHeader.CostCenter}'`);
        }
        if (!libVal.evalIsEmpty(binding.WorkOrderOperation.WOHeader.ControllingArea)) {
            queryBuilder.addFilter(`ControllingArea eq '${binding.WorkOrderOperation.WOHeader.ControllingArea}'`);
        }
    }

    queryBuilder.addExtra('orderby=ActivityType asc');    
    specifier.setEntitySet('COActivityTypes');
    specifier.setQueryOptions(queryBuilder.build());
    specifier.setService('/SAPAssetManager/Services/AssetManager.service');
    activityTypeControl.setTargetSpecifier(specifier);

    if (!context.getClientData().LOADED) {
        context.getClientData().UPDATOR = 'NONE';
        context.getClientData().LOADED = true;
    }

    return true;
}

export function getContextObjects(context) {

    let binding = context.getBindingObject();

    let result = {};
    let odataType = binding['@odata.type'];
    if (odataType === '#sap_mobile.MyWorkOrderHeader') {
        result.workCenter = binding.MainWorkCenter;
        result.woReadLink = binding['@odata.readLink'];
    } else if (odataType === '#sap_mobile.MyWorkOrderOperation') {
        result.workCenter = binding.WOHeader.MainWorkCenter;
        result.woReadLink = binding.WOHeader['@odata.readLink'];
        result.opReadLink = binding['@odata.readLink'];
    } else {
        result.workCenter = binding.WorkOrderOperation.WOHeader.MainWorkCenter;
        result.woReadLink = binding.WorkOrderOperation.WOHeader['@odata.readLink'];
        result.opReadLink = binding.WorkOrderOperation['@odata.readLink'];
        result.subOpReadLink = binding['@odata.readLink'];
        context.getClientData().subOpPickerIsLocked = true;
    }

    return result;
} 

export function setListPickerValue(control, value) {

    if (value === undefined) {
        return;
    }
    libCommon.setFormcellNonEditable(control);
    control.setValue(value);
}

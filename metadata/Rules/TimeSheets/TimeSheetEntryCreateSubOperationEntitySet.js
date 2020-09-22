import libForm from '../Common/Library/FormatLibrary';
export default function TimeSheetEntryCreateSubOperationEntitySet(context) {
    let binding = context.binding;
    let returnValue = [];
    let odataType = binding['@odata.type'];
    if (odataType === '#sap_mobile.MyWorkOrderSubOperation') {
        returnValue.push({DisplayValue: libForm.formatListPickerDisplayValue(context,binding.SubOperationNo, binding.OperationShortText), ReturnValue: binding['@odata.readLink']});
        return returnValue;
    } else if (odataType === '#sap_mobile.MyWorkOrderOperation') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink']+'/SubOperations', [], '').then(function(result) {
            if (result && result.length > 0) {
                result.forEach(function(value) {
                    returnValue.push({DisplayValue: libForm.formatListPickerDisplayValue(context,value.SubOperationNo, value.OperationShortText), ReturnValue: value['@odata.readLink']});
                });
                return returnValue;
            } else {
                return [];
            }
        });
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', [], "$filter=OrderId eq '"+binding.OrderId+"'").then(function(result) {
            if (result && result.length > 0) {
                result.forEach(function(value) {
                    returnValue.push({DisplayValue: libForm.formatListPickerDisplayValue(context,value.SubOperationNo, value.OperationShortText), ReturnValue: value['@odata.readLink']});
                });
                return returnValue;
            } else {
                return [];
            }
        });
    }
}

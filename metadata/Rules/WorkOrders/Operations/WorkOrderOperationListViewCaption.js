import queryOptions from './WorkOrderOperationsListViewQueryOption';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import IsOperationLevelAssigmentType from './IsOperationLevelAssigmentType';
export default function WorkOrderOperationListViewCaption(context) {
    var entitySet;
    var queryOption;
    var localizeText;
    var localizeText_x_x;
    if (CommonLibrary.isDefined(context.binding['@odata.readLink'])) {
    switch (context.binding['@odata.readLink'].split('(')[0]) {
        case 'MyWorkOrderHeaders':
            entitySet = context.binding['@odata.readLink'] + '/Operations';
            queryOption = queryOptions(context);
            localizeText = 'operations_x';
            break;
        case 'MyWorkOrderOperations':
            entitySet = context.binding['@odata.readLink'] + '/SubOperations';
            queryOption = '';
            localizeText = 'suboperations_x';
            break;
        default:
            break;

    } 
        return context.count('/SAPAssetManager/Services/AssetManager.service',entitySet,queryOption).then(count => {
            let params=[count];
            return context.setCaption(context.localizeText(localizeText, params));
        });
    } else {
            if (IsOperationLevelAssigmentType(context)) {
                entitySet = 'MyWorkOrderOperations';
                queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
                localizeText = 'operations_x';
                localizeText_x_x = 'operations_x_x';
            }
            if (CommonLibrary.getWorkOrderAssignmentType(context) === '3') {
                entitySet = 'MyWorkOrderSubOperations';
                queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
                localizeText = 'suboperations_x';
                localizeText_x_x = 'suboperations_x_x';
            }
        var params = [];
        let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service',entitySet, '');
        let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service',entitySet,queryOption);

        return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
            let totalCount = resultsArray[0];
            let count = resultsArray[1];
            params.push(count);
            params.push(totalCount);
            if (count === totalCount) {
                return context.setCaption(context.localizeText(localizeText, [totalCount]));
            }
            return context.setCaption(context.localizeText(localizeText_x_x, params));
        });
    }
}

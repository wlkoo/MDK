import libVal from '../Common/Library/ValidationLibrary';
import { WorkOrderLibrary as libWo} from './WorkOrderLibrary';

export default function WorkOrderListViewCaption(context) {

    let queryOption;
    if (context.binding.isHighPriorityList) {
        queryOption = libWo.getFilterForHighPriorityWorkorders();
    } else {
        queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
    }

    var params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', '');
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders',queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
        let totalCount = resultsArray[0];
        let count = resultsArray[1];
        params.push(count);
        params.push(totalCount);
        if (count === totalCount) {
            return context.setCaption(context.localizeText('work_order_x', [totalCount]));
        }
        return context.setCaption(context.localizeText('work_order_x_x', params));
    });
}

import common from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderHistoryLinks(context) {
    var links = [];
    var flocValue = common.getListPickerValue(common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:FunctionalLocationLstPkr/#Value'));
    var equipmentValue = common.getListPickerValue(common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:EquipmentLstPkr/#Value'));
    if (equipmentValue) {
        links.push({
            'Property': 'Equipment_Nav',
            'Target':
            {
                'EntitySet': 'MyEquipments',
                'ReadLink': `MyEquipments('${equipmentValue}')`,
            },
        });
    } else if (flocValue) {
        links.push({
            'Property': 'FuncLoc_Nav',
            'Target':
            {
                'EntitySet': 'MyFunctionalLocations',
                'ReadLink': `MyFunctionalLocations('${flocValue}')`,
            },
        });
    
    }
    var planningPlantValue = common.getListPickerValue(common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:PlanningPlantLstPkr/#Value'));
    var orderTypeValue = common.getListPickerValue(common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:TypeLstPkr/#Value'));
    var priorityValue = common.getListPickerValue(common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:PrioritySeg/#Value'));
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['PriorityType'], `$filter=PlanningPlant eq '${planningPlantValue}' and OrderType eq '${orderTypeValue}'`).then(orderTypes => {
        if (orderTypes.getItem(0)) {
            let priorityType = orderTypes.getItem(0).PriorityType;
            if (!libVal.evalIsEmpty(priorityValue)) {
                let priorityLink = context.createLinkSpecifierProxy(
                    'HistoryPriority',
                    'Priorities',
                    `$filter=PriorityType eq '${priorityType}' and Priority eq '${priorityValue}'`
                );
                links.push(priorityLink.getSpecifier());
            }
        }
        return links;
    });
}

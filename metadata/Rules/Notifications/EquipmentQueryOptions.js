export default function EquipmentQueryOptions(context) {
    let floc = context.getPageProxy().binding.HeaderFunctionLocation;

    if (floc) {
        return `$filter=FuncLocId eq '${floc}'&$orderby=EquipId`;
    } else {
        return '$orderby=EquipId';
    }
}

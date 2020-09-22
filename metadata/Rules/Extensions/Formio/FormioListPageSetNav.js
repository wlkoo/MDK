export default function FormioListPageSetNav(context) {
    let binding = {'FormioListType': { }};
    if (context.getPageProxy().binding) {
        Object.assign(binding, context.getPageProxy().binding);
    }
    binding.FormioListType = context.getName() === "OverviewPageSectionedTable" ? "Pending" : "Submitted";
    context.getPageProxy().setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/Extensions/Formio/FormioListNav.action');
}

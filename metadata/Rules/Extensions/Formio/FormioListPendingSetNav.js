export default function FormioListPendingSetNav (context) {
    let binding = {'FormioSelectedForm': { }, 'ObjectKey': {} };
    if (context.getPageProxy().binding) {
        Object.assign(binding, context.getPageProxy().binding);
    }
    context.getPageProxy().setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/Extensions/Formio/FormioListPendingNav.action');
}
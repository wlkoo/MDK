export default function FormioRendererSetNav(context) {
    let binding = {'FormioSelectedForm': { }};
    if (context.getPageProxy().binding) {
        Object.assign(binding, context.getPageProxy().binding);
    }
    binding.FormioSelectedForm = context.getPageProxy().getActionBinding().Uuid;
    context.getPageProxy().setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/Extensions/Formio/FormioRendererNav.action');
}
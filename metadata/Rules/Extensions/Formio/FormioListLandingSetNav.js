export default function FormioListLandingSetNav (context) {
    let binding = {'FormioSelectedForm': { }, 'FormioSelectedFormName': {} };
    let actionBinding = context.getPageProxy().getActionBinding();
    if (context.getPageProxy().binding) {
        Object.assign(binding, context.getPageProxy().binding);
    }
    binding.FormioSelectedForm = actionBinding.Uuid;
    binding.FormioSelectedUuid = actionBinding.Uuid;
    binding.FormioSelectedFormName = actionBinding.Name;
    context.getPageProxy().setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/Extensions/Formio/FormioLandingNav.action');
}
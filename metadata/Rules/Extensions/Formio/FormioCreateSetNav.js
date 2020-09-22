import { FormioEventLibrary as libFormioEvent } from './FormioLibrary';

export default function FormioCreateSetNav(context) {
    let binding = {'FormioSelectedForm': { }};
    if (context.getPageProxy().binding) {
        Object.assign(binding, context.getPageProxy().binding);
    }
    
    binding.FormioUuid = context.binding.FormioSelectedUuid;
    if (!binding.FormioUuid) {
        binding.FormioUuid = context.getPageProxy().getActionBinding().Uuid;
    }

    context.getPageProxy().setActionBinding(binding);
    libFormioEvent.createSetNav(context);
}
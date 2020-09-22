import { FormioEventLibrary as libFormioEvent } from './FormioLibrary';

export default function FormioListCreateUpdateSetNav (context) {
   if(context.binding.FormioSelectedForm) {
        libFormioEvent.createSetNav(context);
    } else {
        let assignedForm = context.getControl("SectionedTable").getSections()[0].binding;
        if(assignedForm.length) {
            let assignedFormFiltered = assignedForm.filter(function (form) {
                return form.ObjectKey === context.binding.ObjectKey;
            });
        
            let formioFilter = [];
            assignedFormFiltered.forEach(function(element) {
                formioFilter.push(element.FormUuid);
            });
        
            let binding = {'FormioFormsFilter': { }};
            if (context.getPageProxy().binding) {
                Object.assign(binding, context.getPageProxy().binding);
            }
            binding.FormioFormsFilter = formioFilter;
            context.getPageProxy().setActionBinding(binding);
        }
    
        return context.executeAction("/SAPAssetManager/Actions/Extensions/Formio/FormioSelectionListNav.action");
    }
}
import libCommon from '../../Common/Library/CommonLibrary';

export default function FormioGetSelectedFormUuid(context) {
    let selectedForm = context.binding.FormioSelectedUuid;
    if(!selectedForm) {
        let selectedFormVal = libCommon.getTargetPathValue(context, '#Page:FormioCreateUpdate/#Control:FormSelector/#Value/')[0].ReturnValue;
        selectedForm = selectedFormVal.split("|")[0];
    }
    return selectedForm;
}
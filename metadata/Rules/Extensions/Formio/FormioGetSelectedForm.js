import libCommon from '../../Common/Library/CommonLibrary';

export default function FormioGetSelectedForm(context) {
    let selectedForm = libCommon.getTargetPathValue(context, '#Page:FormioCreateUpdate/#Control:FormSelector/#Value/')[0].ReturnValue;
    return selectedForm.split("|")[1]; 
}
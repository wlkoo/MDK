import { FormioLibrary as libFormio } from './FormioLibrary';

export default function FormioListGetStatusText (context) {
    let aFilter = [];
    aFilter.push("ObjectKey eq '" + context.binding.ObjectKey + "'");
    aFilter.push("Uuid eq guid'" + context.binding.Uuid + "'");
    
    let sFilter = libFormio.createFilter(aFilter, ' and ');

    return context.read('/SAPAssetManager/Services/Formio.service', 'ZEQ_FORMIO_MEDIA', [], sFilter).then(aResult => {
        return aResult.length > 0 ? context.localizeText('form_pending_update') : "";
    });
}
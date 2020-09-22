export default function FormioLandingViewSubmissionVisible (context) {
    let sFilter = "$filter=ObjectKey eq '" + context.binding.ObjectKey + "' and FormUuid eq guid'" + context.binding.FormioSelectedUuid + "'";
    let bVisible = true;
    return context.read('/SAPAssetManager/Services/Formio.service', 'ZEQ_FORMIODATA_C', [], sFilter).then((aResult) => {
        if(aResult.length === 0) {
            bVisible = false;
        }
        return bVisible;
    });
}
export default function FormioLandingViewSubmissionCount (context) {
    let sFilter = "$filter=ObjectKey eq '" + context.binding.ObjectKey + "' and FormUuid eq guid'" + context.binding.FormioSelectedUuid + "'";
    return context.read('/SAPAssetManager/Services/Formio.service', 'ZEQ_FORMIODATA_C', [], sFilter).then((aResult) => {
       return aResult.length;
    });
}
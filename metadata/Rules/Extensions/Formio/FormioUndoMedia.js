export default function FormioUndoMedia (context) {
    return context.executeAction('/SAPAssetManager/Actions/DiscardWarningMessage.action').then(successResult => {
        if (successResult.data) {
            if(context.binding.FormioEditLink) {
                return context.executeAction('/SAPAssetManager/Actions/Extensions/Formio/FormioMediaUndoPendingChanges.action').then(result => {
                    return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
                });
            } else {
                return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
            }
        }
    });   
}
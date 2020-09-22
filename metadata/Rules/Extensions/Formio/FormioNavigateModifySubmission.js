export default function FormioNavigateModifySubmission (context) {
    return context.executeAction('/SAPAssetManager/Actions/Extensions/Formio/FormioExternalNavWarning.action').then(successResult => {
        if (successResult.data) {
            const utilsModule = context.nativescript.utilsModule;
            let url = "https://appsrv25.vesta.rizing.com:8443/sap/bc/ui2/flp?sap-client=110&sap-language=EN#FormSubmission-display&/ZEQ_FORMIODATA_C/" + 
                        context.binding.FormioUuid + "/" + "ORI/" + context.binding.ObjectKey;
            return utilsModule.openUrl("com.sap.fiori.client.xcallbackurl://x-callback-url/openFioriUrl?url=" + url);
        }
    });
}


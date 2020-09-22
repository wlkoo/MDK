import { FormioLibrary as libFormio } from './FormioLibrary';

export default function FormioDisplaySetNav(context) {
    let binding = {'FormioSelectedForm': { }, 'FormioData': { }};
    if (context.getPageProxy().binding) {
        Object.assign(binding, context.getPageProxy().binding);
    }
    let pageProxy = context.getPageProxy();

    let getForm = context.read('/SAPAssetManager/Services/Formio.service', 'ZEQL_C_FORMIO', [], "$filter=Uuid eq guid'" + pageProxy.getActionBinding().FormUuid + "'");
    let getLocalMedia = libFormio.getLocalMedia(context);
    return Promise.all([getForm, getLocalMedia]).then((aResult) => {
        binding.FormioSelectedForm = aResult[0].getItem(0).FormData;
        binding.FormioAction = 'Display';
        binding.FormioUuid = pageProxy.getActionBinding().Uuid;
        binding.FormioSelectedUuid = pageProxy.getActionBinding().FormUuid;

        //If local media exist, use it since it is an update
        binding.FormioData = aResult[1] === "" ? pageProxy.getActionBinding().FormData : aResult[1];

        context.getPageProxy().setActionBinding(binding);
        return context.executeAction('/SAPAssetManager/Actions/Extensions/Formio/FormioRendererNav.action');
    });
}
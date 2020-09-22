import { FormioLibrary as libFormio } from './FormioLibrary';

export default function FormioUpdateSetNav(context) {
    let binding = {'FormioSelectedForm': { }, 'FormioData': { }};
    if (context.getPageProxy().binding) {
        Object.assign(binding, context.getPageProxy().binding);
    }
    let pageProxy = context.getPageProxy();

    let getForm = context.read('/SAPAssetManager/Services/Formio.service', 'ZEQL_C_FORMIO', [], "$filter=Uuid eq guid'" + pageProxy.getActionBinding().FormUuid + "'");
    let getLocalMedia = libFormio.getLocalMedia(context);
    return Promise.all([getForm, getLocalMedia]).then((aResult) => {
        binding.FormioSelectedForm = aResult[0].getItem(0).FormData;
        binding.FormioAction = 'Update';
        binding.FormioUuid = pageProxy.getActionBinding().Uuid;
        binding.FormioSelectedUuid = pageProxy.getActionBinding().FormUuid;

        //If local media exist, use it since it is an update
        if(aResult[1].Data === "") {
            binding.FormioData = pageProxy.getActionBinding().FormData;
        } else {
            binding.FormioData = aResult[1].Data;
            binding.FormioEditLink = aResult[1].EditLink;
        }

        context.getPageProxy().setActionBinding(binding);
        return context.executeAction('/SAPAssetManager/Actions/Extensions/Formio/FormioRendererNav.action');
    });
}
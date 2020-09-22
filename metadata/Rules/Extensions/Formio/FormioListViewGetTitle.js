export default function FormioListViewGetTitle(context) {
    return context.read('/SAPAssetManager/Services/Formio.service', 'ZEQL_C_FORMIO', [], "$filter=Uuid eq guid'" + context.binding.FormUuid + "'").then(obArray => {
        return obArray.getItem(0).Name;
    });
}

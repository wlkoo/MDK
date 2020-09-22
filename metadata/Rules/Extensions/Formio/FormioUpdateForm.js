export default function FormioUpdateForm(context) {
  context.getPageProxy().executeAction("/SAPAssetManager/Actions/Extensions/Formio/FormioCreateMedia.action").then(aResult => {
    console.log(aResult);
  });
}
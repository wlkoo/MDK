import DocLib from '../DocumentLibrary';
import documentValidateCreate from '../DocumentValidation';
export default function DocumentCreateDelete(context) {

    //*************DELETE DOCUMENTS *********************/
    const attachmentFormcell = context.getControl('FormCellContainer').getControl('Attachment');
    const deletedAttachments = attachmentFormcell.getClientData().DeletedAttachments;
    // create an rray with all the readLinks to process
    context.getClientData().DeletedDocReadLinks = deletedAttachments.map((deletedAttachment) => {
        return deletedAttachment.readLink;
    });

    let deletes = deletedAttachments.map(() => {
        //call the delete doc delete action
        return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentDeleteBDS.action');
    });

    return Promise.all(deletes).then(() => {
      //*************CREATE DOCUMENTS *********************/
        const attachmentCount = DocLib.validationAttachmentCount(context);
        if (attachmentCount > 0) {
            return documentValidateCreate(context,'',attachmentFormcell);
        }
        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action'); 
    });
}

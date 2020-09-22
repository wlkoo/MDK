import libCom from '../../Common/Library/CommonLibrary';

export default function ChecklistCreateOnCommit(context) {

    //Reset the current checklist variables
    //Checklist-AssessmentId is the current assessment id
    //Checklist-FormId is the current form id and is used for the changeset transaction id
    //Checklist-TemplateId is the current template id
    //Checklist-Rows is the array of questions that need to be created for the new checklist
    //Checklist-Question is the current row being created
    libCom.clearFromClientData(context, ['Checklist-Question','Checklist-AssessmentId','Checklist-FormId','Checklist-TemplateId','Checklist-Rows'], undefined, true);
    //Run through all the checklist create actions for the changeset
    return context.executeAction('/SAPAssetManager/Actions/Checklists/Create/FormCreate.action').then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Checklists/Create/FormBusObjectCreate.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action'); //Ends the changeset
        });        
    });
}

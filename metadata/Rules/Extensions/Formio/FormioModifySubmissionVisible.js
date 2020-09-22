export default function FormioModifySubmissionVisible (context) {
    return context.binding.FormioAction === "Display" ? true : false;
}
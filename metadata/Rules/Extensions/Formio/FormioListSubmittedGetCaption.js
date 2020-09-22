export default function FormioListSubmittedGetCaption (context) {
    return context.binding.FormioSelectedFormName !== undefined ? context.binding.FormioSelectedFormName : "Forms Submitted";
}
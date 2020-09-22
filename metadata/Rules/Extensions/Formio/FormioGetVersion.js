export default function FormioGetVersion (context) {
    return context.localizeText('form_version') + ": " + context.binding.Version; 
}
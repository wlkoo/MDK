import { FormioLibrary as libFormio } from './FormioLibrary';

export default function FormioListPendingViewGetStatusText (context) {
    return context.binding.CreatedAt ? context.localizeText('form_create') : context.localizeText('form_update');
}
import { FormioLibrary as libFormioLibrary } from './FormioLibrary';

export default function FormioListViewQueryOptions(context) {
    return libFormioLibrary.getFormsAssigned(context).then(aForm => {
        let sFilter = "";
        if(aForm.length > 0) {
            sFilter = libFormioLibrary.createFilter(aForm, ' or ');
        } else {
            sFilter = "$filter=Uuid eq guid'00000000-0000-0000-0000-000000000000'";
        }
        return sFilter;
    });
}
import { FormioLibrary as libFormioLibrary } from './FormioLibrary';

export default function FormsOverviewTitleCount(context) {
    return libFormioLibrary.getFormsAssigned(context).then(aForm => {
        return aForm.length;
    });
}
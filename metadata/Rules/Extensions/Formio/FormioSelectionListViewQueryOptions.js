import { FormioLibrary as libFormioLibrary } from './FormioLibrary';

export default function FormioSelectionListViewQueryOptions (context) {
    let formsFilter = context.binding.FormioFormsFilter;
    let sFilter = "";
    if(formsFilter) {
        let aFilter = [];
        if(formsFilter) {
            formsFilter.forEach(function(element) {
                aFilter.push("Uuid ne guid'" + element + "'");
            });
        }
        sFilter = libFormioLibrary.createFilter(aFilter, ' and ');
    }
    return sFilter;
}
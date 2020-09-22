import { FormioLibrary as libFormio } from './FormioLibrary';

export default function FormioListPendingViewQueryOptions (context) {
    let aFilter = [];
    aFilter.push("ObjectKey eq '" + context.binding.ObjectKey + "'");
    aFilter.push("FormUuid eq guid'" + context.binding.FormioSelectedForm + "'");
    
    let sFilter = libFormio.createFilter(aFilter, ' and ');
    return sFilter;
}
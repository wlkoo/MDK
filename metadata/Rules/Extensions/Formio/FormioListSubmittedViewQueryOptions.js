export default function FormioListSubmittedViewQueryOptions(context) {
    return "$filter=ObjectKey eq '" + context.binding.ObjectKey + "' and FormUuid eq guid'" + context.binding.FormioSelectedForm + "'&$orderby=CreatedAt desc";
}

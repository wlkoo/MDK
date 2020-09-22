export default function FormioListViewQueryOptionsPending(context) {
    return "$filter=ObjectKey eq '" + context.binding.ObjectKey + "'&$orderby=CreatedAt desc";
}

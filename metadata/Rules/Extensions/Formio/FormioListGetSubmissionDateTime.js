export default function FormioListGetSubmissionDateTime (context) {
    return "Submitted on: " + context.formatDatetime(context.binding.CreatedAt);
}
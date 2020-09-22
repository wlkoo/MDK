import MarkedJobLibrary from '../../MarkedJobs/MarkedJobLibrary';

export default function Icon(context) {
    // TODO: get "is marked" api call
    if (MarkedJobLibrary.isMarked(context)) {
        return 'ActionIsMarked';
    }
    // Else, this is item is not marked
    return 'ActionNotMarked';
}

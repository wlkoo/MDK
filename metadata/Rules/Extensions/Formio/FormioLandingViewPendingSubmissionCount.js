import {FormioLibrary as formLibrary} from './FormioLibrary';

export default function FormioLandingViewPendingSubmissionCount (context) {    
    return formLibrary.getFormMediaCount(context).then(count => {
        return count;
    });
}
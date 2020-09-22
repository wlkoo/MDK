import {FormioLibrary as formLibrary} from './FormioLibrary';

export default function FormioLandingViewPendingSubmissionVisible (context) {    
    return formLibrary.getFormMediaCount(context).then(count => {
        if(count > 0) {
            return true;
        } else {
            return false;
        }
    });
}
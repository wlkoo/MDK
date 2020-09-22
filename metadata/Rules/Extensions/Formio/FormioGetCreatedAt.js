import libCom from '../../Common/Library/CommonLibrary';

export default function FormioGetCreatedAt (context) {
    let dt = new Date();
    let backendOffset = libCom.getBackendOffsetFromSystemProperty(context) * 60 * 60 * 1000;	
    let dateTime = new Date(dt.getTime() - backendOffset);
    return dateTime;
}

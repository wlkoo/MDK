import GetStartDateTime from './GetStartDateTime';
import ODataDate from '../../../Common/Date/ODataDate';

export default function GetDate(context) {
    //let date = libCom.getControlProxy(context,'StartDatePicker').getValue();
    let date = new Date(GetStartDateTime(context));
    let odataDate = new ODataDate(date);
    return odataDate.toDBDateString(context);
}

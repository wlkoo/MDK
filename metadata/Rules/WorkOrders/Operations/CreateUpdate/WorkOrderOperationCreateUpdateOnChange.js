import {OperationEventLibrary as libOperationEvent} from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationCreateUpdateOnChange(controlProxy) {
    libOperationEvent.createUpdateOnChange(controlProxy);
}

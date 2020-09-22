
import MobileStatusAction from '../../MobileStatus/MobileStatusAction';

export default class UnconfirmOperationMobileStatusAction extends MobileStatusAction {

    didSetConfirmationParams(context) {
        context.getClientData().FinalConfirmationOrderID = this.args.WorkOrderId;
        context.getClientData().FinalConfirmationOperation = this.args.OperationId;
        // Make sure this is found but blank
        context.getClientData().FinalConfirmationSubOperation = '';
        context.getClientData().FinalConfirmation = '';

        return true;
    }

    entitySet() {
        return 'MyWorkOrderOperations';
    }

    identifier() {
        return `OperationNo='${this.args.OperationId}',OrderId='${this.args.WorkOrderId}'`;
    }
}

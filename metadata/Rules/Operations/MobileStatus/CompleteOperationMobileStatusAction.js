
import FetchRequest from '../../Common/Query/FetchRequest';
import CompleteMobileStatusAction from '../../MobileStatus/CompleteMobileStatusAction';
import CompleteWorkOrderMobileStatusAction from '../../WorkOrders/MobileStatus/CompleteWorkOrderMobileStatusAction';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

/**
 * Operation for executing a 
 */
export default class CompleteOperationMobileStatusAction extends CompleteMobileStatusAction {
    
    name() {
        return 'CompleteMobileStatusAction_Operation';
    }

    getDefaultArgs() {
        let defaultArgs = super.getDefaultArgs();
        defaultArgs.doCheckWorkOrderComplete = true;
        return defaultArgs;
    }

    setActionQueue(actionQueue) {

        if (this.args.isOperationStatusChangeable) { //Set the mobile status to Complete only if operation level assignment
            actionQueue.unshift(this.setMobileStatusComplete);
        }

        // Add a check to see if the parent Work Order should be completed
        if (this.args.doCheckWorkOrderComplete) {
            actionQueue.push(this.executeCheckWorkOrderCompleted);
        } 
        super.setActionQueue(actionQueue);
    }

    entitySet() {
        return 'MyWorkOrderOperations';
    }

    identifier() {
        return `OperationNo='${this.args.OperationId}',OrderId='${this.args.WorkOrderId}'`;
    }

    didSetFinalConfirmationParams(context) {
        context.getClientData().FinalConfirmationOrderID = this.args.WorkOrderId;
        context.getClientData().FinalConfirmationOperation = this.args.OperationId;
        // Make sure this is found but blank
        context.getClientData().FinalConfirmationSubOperation = '';
        context.getClientData().FinalConfirmation = 'X';
        
        return super.didSetFinalConfirmationParams(context);
    }

    requestSetWorkOrderComplete(context, instance) {

        return context.executeAction('/SAPAssetManager/Actions/MobileStatus/MobileStatusOperationCompleteConfirmation.action').then((doSetComplete) => {
            if (doSetComplete.data === true) {
                // TODO: Add Action to chain for setting WO complete
                let actionArgs = {
                    WorkOrderId: instance.args.WorkOrderId,
                };
                instance.pushLinkedAction(new CompleteWorkOrderMobileStatusAction(actionArgs));
            }
            return Promise.resolve(true);
        });
    }

    executeCheckWorkOrderCompleted(context, instance) {

        if (!MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            // Cannot change the Work Order, exit early
            return Promise.resolve(true);
        }
        let args = instance.args;

        return MobileStatusLibrary.isMobileStatusComplete(context, 'MyWorkOrderHeaders', args.WorkOrderId).then(status => {
            if (status) { //already complete so exit
                return Promise.resolve(true);
            } else {
                // Count the number of Operations that have a mobile status 
                return MobileStatusLibrary.getStatusForOperations(context, args.WorkOrderId).then(query => {
                    let fetchRequest = new FetchRequest('MyWorkOrderOperations', query);
            
                    return fetchRequest.execute(context).then(results => {
                        // Second clause was added because we were seeing something funky. DB didn't seem to be updating before the above query
                        if (results.length === 0 || (results.length === 1 && results.getItem(0).OperationNo === args.OperationId)) {
                                // There are no Operations of this Work Order.
                                // Ask user if they would like to complete the Work Order
                            return instance.requestSetWorkOrderComplete(context, instance);
                        }
                        return Promise.resolve(true);
                    });
                });
            }
        }); 
        
    }
}

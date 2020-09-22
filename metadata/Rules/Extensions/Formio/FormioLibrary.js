import libCommon from '../../Common/Library/CommonLibrary';
import { FormioControlsLibrary as libFormioControls } from './FormioLibrary';

export class FormioLibrary {
	static createFilter(aFilters, sClause) {
		let queryString = '$filter=';
		for (let sfilter of aFilters) {
			queryString += sfilter;
			queryString += sClause;
		}

		// Trim off the last 'or' clause
		queryString = queryString.substring(0, queryString.length - sClause.length);

		return queryString;
	}

	static getNewUuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	static getFormMediaCount(context) {
		let objectKey = context.binding.ObjectKey;
		let formUuid = context.binding.FormioSelectedForm;
		return context.read('/SAPAssetManager/Services/Formio.service', 'ZEQ_FORMIO_MEDIA', []).then(aResult => {
			let filtered = aResult.filter(element => { return (element.ObjectKey === objectKey && element.FormUuid === formUuid) });			
			return filtered ? filtered.length : 0;
		});
	}

	static getLocalMedia(context) {
		let aFilter = [];
		aFilter.push("ObjectKey eq '" + context.getPageProxy().getActionBinding().ObjectKey + "'");
		aFilter.push("Uuid eq guid'" + context.getPageProxy().getActionBinding().Uuid + "'");
		
		let sFilter = this.createFilter(aFilter, ' and ');

		return context.read('/SAPAssetManager/Services/Formio.service', 'ZEQ_FORMIO_MEDIA', [], sFilter).then(aResult => {
			if(aResult.length === 0) {
				return "";
			}
			let readLink = aResult.map(element => element)[0]["@odata.readLink"];
			let localFile = this.getLocalMediaId(readLink) + ".txt"
			return {
				Data :	context.nativescript.fileSystemModule.knownFolders.temp().getFolder("FormioSubmission").getFile(localFile).readTextSync(),
				EditLink: aResult.map(element => element)[0]["@odata.editLink"]
			}
		});
	}

	static getLocalMediaId (readLink) {
		let odataID = readLink;
		// Retrieving ID from the string
		let start = odataID.indexOf('\'');
		let end = odataID.lastIndexOf('\'');
		// Need to do start+1 because we dont want ' in our id
		return odataID.substring(start+1, end);
	}

	static getFormsAssigned (context) {
		let sFilter = "$filter=ObjectKey eq '" + context.binding.ObjectKey + "'";
		
		//Get Forms Assigned and Forms Freely Submitted
		let getFormAssignment = context.read('/SAPAssetManager/Services/Formio.service', 'ZEQL_C_FORMIOASSIGN', [], sFilter);
		let getFormSubmission = context.read('/SAPAssetManager/Services/Formio.service', 'ZEQ_FORMIODATA_C', [], sFilter);
		let getLocalForms = context.read('/SAPAssetManager/Services/Formio.service', 'ZEQ_FORMIO_MEDIA', [], sFilter);

		return Promise.all([getFormAssignment, getFormSubmission, getLocalForms]).then((aResult) => {
			let jsonResult = [];
			for(let i = 0; i < aResult.length; i++) {
				aResult[i].forEach(function(element) {
					jsonResult.push("Uuid eq guid'" + element.FormUuid + "'");
				});
			}
			
			const uniqueSet = new Set(jsonResult);
			let aForm = [...uniqueSet];
	
			return aForm;
		});
	}
}

/**
 * This stores the Dynamic Forms event related methods
 */
export class FormioEventLibrary {

	/**
     * This will returns the correct PickerItems for the Picker Controls
     * @param {IControlProxy} controlProxy 
     */
    static createUpdateControlsPickerItems(controlProxy) {
        let controlName = controlProxy.getName();

        // Based on the control we are on, return the right list items accordingly
        if (controlName === 'FormSelector') {
			let formsFilter = controlProxy.binding.FormioFormsFilter;
			let sFilter = "";
			if(formsFilter) {
				let aFilter = [];
				if(formsFilter) {
					formsFilter.forEach(function(element) {
						aFilter.push("Uuid ne guid'" + element + "'");
					});
				}
				sFilter = this.createFilter(aFilter, ' and ');
			}
			
			return controlProxy.read('/SAPAssetManager/Services/Formio.service', 'ZEQL_C_FORMIO', [], sFilter).then(aResult => {
				let jsonResult = [];
				aResult.forEach(function(element) {
					jsonResult.push(
						{
							'DisplayValue': `${element.Name} - ${element.CreatedBy}`,
							'ReturnValue': `${element.Uuid}|${element.FormData}`,
						});
				});
				const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
				let finalResult = [...uniqueSet].map(item => JSON.parse(item));
				return finalResult;
			});
        }
	}
	
	static createSetNav(context) {
		let binding = {'FormioSelectedForm': { }, 'FormioData': { }};
		if (context.getPageProxy().binding) {
			Object.assign(binding, context.getPageProxy().binding);
		}
		
		let pageProxy = context.getPageProxy();
		let formUuid = pageProxy.getActionBinding().FormioUuid;
		if (!formUuid) {
			return;
		}
		
		return context.read('/SAPAssetManager/Services/Formio.service', 'ZEQL_C_FORMIO', [], "$filter=Uuid eq guid'" + formUuid + "'").then(obArray => {
			binding.FormioSelectedForm = obArray.getItem(0).FormData;
			binding.FormioData = "";
			binding.FormioAction = 'Create';
			binding.FormioSelectedUuid = formUuid;
			context.getPageProxy().setActionBinding(binding);
			return context.executeAction('/SAPAssetManager/Actions/Extensions/Formio/FormioRendererNav.action');
		});
	}
}
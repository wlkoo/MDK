import GetGeometryInformation from '../Common/GetGeometryInformation';
import GetLocationInformation from '../Common/GetLocationInformation';

export default function WorkOrderLocationFormat(context) {
    let geometryItem = context.getPageProxy().getClientData().geometry;
    switch (context.getProperty()) {
        case 'Title':
            return GetLocationInformation(context).then(result =>{
                if (result !== context.localizeText('no_location_available')) {
                    return result;
                } else {
                    return '';
                }
            }); 
        case 'Subhead':
            return GetLocationInformation(context).then(result =>{
                if (result === context.localizeText('no_location_available')) {
                    return result;
                } else {
                    return '';
                }
            }); 
        case 'AccessoryType':
            if (geometryItem && Object.keys(geometryItem).length > 0) {
                // geometryItem is valid and defined
                return 'disclosureIndicator';
            } else {
                // geometryItem is defined, but empty
                if (geometryItem) {
                    return context.read('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding['@odata.readLink'] + '/FunctionalLocation', [], '').then(function(result) {
                        if (result && result.getItem(0)) {
                            return 'disclosureIndicator';
                        } else {
                            return '';
                        }
                    });
                } else {
                    // geometryItem is invalid and needs to be read
                    return GetGeometryInformation(context.getPageProxy(), 'WOGeometries').then(function(value) {
                        if (value && Object.keys(value).length > 0) {
                            // geometryItem is valid and defined
                            return 'disclosureIndicator';
                        } else {
                            return '';
                        }
                    });
                }
            }
        default:
            return '';
    }
}

import GetDocumentSection from './GetDocumentSection';
import DocumentPath from './DocumentPath';
import libVal from '../Common/Library/ValidationLibrary';
import libCommon from '../Common/Library/CommonLibrary';

let fs = require('tns-core-modules/file-system');
let utils = require('tns-core-modules/utils/utils');

export default function DownloadOrOpenDocument(sectionedTableProxy, documentPropertyName) {
    const pageProxy = sectionedTableProxy.getPageProxy();
    let documentObject = pageProxy.getActionBinding()[documentPropertyName];
    let readLink = documentObject['@odata.readLink'];
    let serviceName = '/SAPAssetManager/Services/AssetManager.service';
    let entitySet = readLink.split('(')[0];
    const docDownloadID = 'DocDownload.' + documentObject.DocumentID;

    if (documentObject.ObjectType === 'URL') {
        return Promise.resolve(utils.openUrl(documentObject.URL.replace('&KEY&', '')));
    } else {
        // Check if media already exists or needs to be downloaded
        return sectionedTableProxy.isMediaLocal(serviceName, entitySet, readLink).then((isMediaLocal) => {
            if (isMediaLocal) {
                let documentPath = DocumentPath(sectionedTableProxy, documentObject);

                let writeError = undefined;
                let promise = Promise.resolve(documentPath);

                if (!fs.File.exists(documentPath)) {
                    promise = sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadMedia.action').then(() => {
                        // the media has been downloaded, we can open it -> the path needs to be provided in the action definition
                        // or it should come from binding
                        let documentFileObject = fs.File.fromPath(documentPath);
                        let content = pageProxy.getClientData()[documentObject['@odata.readLink']];
                        if (libVal.evalIsEmpty(documentPath) || typeof documentObject === 'undefined') {
                            return pageProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action');
                        }
                        documentFileObject.writeSync(content, err => {
                            writeError = err;
                        });
                        libCommon.clearFromClientData(sectionedTableProxy, docDownloadID, undefined, true);
                        return documentPath;
                    });
                }

                return promise.then(docPath => {
                    if (writeError) {
                        actionPath = '/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action';
                    }
                    pageProxy.setActionBinding({
                        'FileName': docPath,
                    });
                    let actionPath = '/SAPAssetManager/Actions/Documents/DocumentOpen.action';
                    return pageProxy.executeAction(actionPath);
                });
            } else {
                // The media is on the server. This server could be SAP backend or it could be cached on OData Offline Service on HCP.
                // We need to download it.

                /*
                    Check state of media. If media download is already in progress, then prevent user from requesting
                    media from server again. Multiple clicks from the user, send multiple requests for the same media 
                    to the server, resulting in errors being thrown and the document still downloading successfully.
                */
                let isDownloadInProgress = libCommon.getStateVariable(sectionedTableProxy, docDownloadID);
                // If download is already in progress, ignore the click from user.
                if (!isDownloadInProgress) {
                    // The media is on the server. This is the user's first request\click to download the media.

                    //Set internal media state to 'in progress'.
                    libCommon.setStateVariable(sectionedTableProxy, docDownloadID, 'inProgress');

                    //Set indicator icon on ObjectCell to be 'in progress' pic to tell user download of media is in progress.
                    const pressedItem = pageProxy.getPressedItem();
                    const objectTableSection = GetDocumentSection(sectionedTableProxy.getSections());
                    objectTableSection.setIndicatorState('inProgress', pressedItem);

                    return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreams.action')
                        .then((result) => {
                            //MDK OfflineOData.Download action returns a resoved Promise on download error. This bug is fixed in MDK 2.1.200.
                            if (result.data && result.data.search(/error/i)) {
                                libCommon.clearFromClientData(sectionedTableProxy, docDownloadID, undefined, true);
                                objectTableSection.setIndicatorState('toDownload', pressedItem);
                                //sectionedTableProxy.redraw();
                                return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action');
                            }
                            return Promise.resolve();
                        }, () => {
                            libCommon.clearFromClientData(sectionedTableProxy, docDownloadID, undefined, true);
                            objectTableSection.setIndicatorState('toDownload', pressedItem);
                            //sectionedTableProxy.redraw();
                            return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action');
                        });
                } else {
                    return Promise.resolve();
                }
            }
        });
    }
}

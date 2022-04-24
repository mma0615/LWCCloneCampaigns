declare module "@salesforce/apex/objSearchController.getObjSearchList" {
  export default function getObjSearchList(param: {objName: any, searchString: any}): Promise<any>;
}
declare module "@salesforce/apex/objSearchController.postRecords" {
  export default function postRecords(param: {selectedRecords: any, postMessage: any}): Promise<any>;
}

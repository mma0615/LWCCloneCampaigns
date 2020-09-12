declare module "@salesforce/apex/cloneCampaignController.getCampaignsList" {
  export default function getCampaignsList(param: {pagenumber: any, numberOfRecords: any, pageSize: any, searchString: any}): Promise<any>;
}
declare module "@salesforce/apex/cloneCampaignController.getCampaignsCount" {
  export default function getCampaignsCount(param: {searchString: any}): Promise<any>;
}
declare module "@salesforce/apex/cloneCampaignController.cloneSelectedCampaigns" {
  export default function cloneSelectedCampaigns(param: {selectedCampaigns: any}): Promise<any>;
}

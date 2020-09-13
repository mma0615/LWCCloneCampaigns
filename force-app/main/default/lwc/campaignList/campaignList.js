import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import getCampaignsList from '@salesforce/apex/cloneCampaignController.getCampaignsList';  
import getCampaignsCount from '@salesforce/apex/cloneCampaignController.getCampaignsCount';
import cloneCampaigns from '@salesforce/apex/cloneCampaignController.cloneSelectedCampaigns';  
export default class RecordList extends LightningElement 
{  
    @track campaigns;  
    @track error;  
    @track selectedCampaigns;
    @api currentpage;  
    @api pagesize;  
    @track searchKey;
    @track bShowModal = false;  
    totalpages;  
    localCurrentPage = null;  
    isSearchChangeExecuted = false;
    toastTitle;
    toastMessage;
    toastVariant; 
    // not yet implemented  
    pageSizeOptions =  
        [  
            { label: '5', value: 5 },  
            { label: '10', value: 10 },  
            { label: '25', value: 25 },  
            { label: '50', value: 50 },  
            { label: 'All', value: '' },  
        ];

    // opening the modal
    openModal() { this.bShowModal = true; }
    // closeing the modal
    closeModal() { this.bShowModal = false;}

    handleKeyChange(event) 
    {  
        if (this.searchKey !== event.target.value) 
        {  
            this.isSearchChangeExecuted = false;  
            this.searchKey = event.target.value;  
            this.currentpage = 1;
            
            this.dispatchEvent(new CustomEvent('first'));   
        }  
    }

    renderedCallback() 
    {  
        // This line added to avoid duplicate/multiple executions of this code.  
        if (this.isSearchChangeExecuted && (this.localCurrentPage === this.currentpage)) 
        {  
            return;  
        }

        this.isSearchChangeExecuted = true;  
        this.localCurrentPage = this.currentpage;  
        getCampaignsCount({ searchString: this.searchKey })  
            .then(recordsCount => 
            {  
                this.totalrecords = recordsCount;  
                if (recordsCount !== 0 && !isNaN(recordsCount)) 
                {  
                    this.totalpages = Math.ceil(recordsCount / this.pagesize);  
                    getCampaignsList({ pagenumber: this.currentpage, numberOfRecords: recordsCount, 
                                    pageSize: this.pagesize, searchString: this.searchKey })  
                        .then(campaignList => 
                        {  
                            this.campaigns = campaignList;  
                            this.error = undefined;  
                        })  
                        .catch(error => 
                        {  
                            this.error = error;  
                            this.campaigns = undefined;  
                        });  
                } 
                else 
                {  
                    this.campaigns = [];  
                    this.totalpages = 1;  
                    this.totalrecords = 0;  
                }  
            
                const event = new CustomEvent('recordsload',
                {  
                    detail: recordsCount  
                });  
            
                this.dispatchEvent(event);  
            })  
            .catch(error => 
            {  
                this.error = error;  
                this.totalrecords = undefined;  
            });  
        }
    
     // Select the all rows
     allSelected(event) 
     {
        let selectedRows = this.template.querySelectorAll('lightning-input');
        
        for(let i = 0; i < selectedRows.length; i++) 
        {
            if(selectedRows[i].type === 'checkbox') 
            {
                selectedRows[i].checked = event.target.checked;
            }
        }
    }
    
    showSelectedCampaigns() 
    {
        this.bShowModal = true;

        this.selectedCampaigns = [];

        let selectedRows = this.template.querySelectorAll('lightning-input');

        // based on selected row getting values of the contact
        for(let i = 0; i < selectedRows.length; i++) {
            if(selectedRows[i].checked && selectedRows[i].type === 'checkbox') 
            {
                this.selectedCampaigns.push(
                {
                    Name: selectedRows[i].value,
                    Id: selectedRows[i].dataset.id
                })
            }
        }
    }


    cloneSelectedCampaigns() 
    {
        this.selectedCampaigns = [];

        let selectedRows = this.template.querySelectorAll('lightning-input');

        // based on selected row getting values of the contact
        for(let i = 0; i < selectedRows.length; i++) {
            if(selectedRows[i].checked && selectedRows[i].type === 'checkbox') 
            {
                this.selectedCampaigns.push(
                {
                    Name: selectedRows[i].value,
                    Id: selectedRows[i].dataset.id
                })
            }
        }

        cloneCampaigns({selectedCampaigns: this.selectedCampaigns})
            .then((result) => 
            {
                if (result === ('Successfully Cloned...' ) )
                {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: result,
                            variant: 'Success'
                            })
                        );
                }
                else
                {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Info',
                            message: result,
                            variant: 'Info'
                            })
                        );
                }
                
            })
            .catch((error) => 
            {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error:',
                        message: error,
                        variant: 'Error'
                        })
                    );
            });
        
    }


} 

/*
        toastTitle = 'Success';
        toastMessage;
        toastVariant = 'Success';

        cloneCampaigns({selectedCampaigns: this.selectedCampaigns})
            .then((result) => 
            {
                this.toastTitle = 'Success';
                this.toastMessage = result;
                this.toastVariant = 'Success';
            })
            .catch((error) => 
            {
                this.toastTitle = 'Error';
                this.toastMessage = error;
                this.toastVariant = 'Error';
            });


            this.dispatchEvent(
                new ShowToastEvent({
                    title: this.toastTitle,
                    message: this.toastMessage,
                    variant: this.toastVariant
                    })
                );
*/
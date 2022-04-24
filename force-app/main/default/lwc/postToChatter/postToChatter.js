import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import getObjSearchList from '@salesforce/apex/objSearchController.getObjSearchList'; 
import postRecords from '@salesforce/apex/objSearchController.postRecords';
import TickerSymbol from '@salesforce/schema/Account.TickerSymbol';

export default class PostToChatter extends LightningElement {

    objName = 'Account';
    @track searchKey;
    @track records;
    @track selectedRecords;
    @track error; 
    isSearchChangeExecuted = false;
    postMessage;

    renderedCallback() 
    {
        // This line added to avoid duplicate/multiple executions of this code.  
        if (this.isSearchChangeExecuted) {  
            return;  
        }
 
        this.isSearchChangeExecuted = true;
        getObjSearchList({ objName: this.objName, searchString: this.searchKey })  
        .then(objectList => {  
            this.records = objectList;  
            this.error = undefined;

            const event = new CustomEvent('recordsload',
            {  
                detail: objectList  
            });  
        
            this.dispatchEvent(event);
        })  
        .catch(error => {  
            this.error = error;  
            this.records = [];  
        });
        
    }

    handleKeyChange(event) 
    {  
        if (this.searchKey !== event.target.value) {  
            this.isSearchChangeExecuted = false;  
            this.searchKey = event.target.value;  
            this.dispatchEvent(new CustomEvent('first'));   
        }  
    }

    // Select the all rows
    allSelected(event) 
    {
       let selectedRows = this.template.querySelectorAll('lightning-input');
       
       for(let i = 0; i < selectedRows.length; i++) {
           if(selectedRows[i].type === 'checkbox') {
               selectedRows[i].checked = event.target.checked;
           }
       }
    }

    postSelectedRecords() 
    {
        if (this.postMessage===null){
            this.dispatchEvent(new ShowToastEvent({
                title: 'ERROR',
                message: 'Please enter a message for posting...',
                variant: 'error'
                })
            );
        }
        else {
            this.selectedRecords = [];
            let selectedRows = this.template.querySelectorAll('lightning-input');
            // based on selected row getting values of the contact
            for(let i = 0; i < selectedRows.length; i++) {
                if(selectedRows[i].checked && selectedRows[i].type === 'checkbox') {
                    this.selectedRecords.push(selectedRows[i].dataset.id)
                }
            }

            if ( this.selectedRecords.length==0){
                this.dispatchEvent(new ShowToastEvent({
                    title: 'ERROR',
                    message: 'Please select at least one record to post...',
                    variant: 'error'
                    })
                );
            }
            else {
                postRecords({selectedRecords: this.selectedRecords, postMessage: this.postMessage})
                .then((result) => {
                    if (result.indexOf('Successfully') >= 0 ) {
                        this.dispatchEvent(new ShowToastEvent({
                                title: 'SUCCESS',
                                message: result,
                                variant: 'Success'
                                })
                            );
                    }
                    else {
                        this.dispatchEvent(new ShowToastEvent({
                                title: 'INFO',
                                message: result,
                                variant: 'Info'
                                })
                            );
                    }
                    
                })
                .catch((error) => {
                    this.dispatchEvent(new ShowToastEvent({
                            title: 'ERROR:',
                            message: error,
                            variant: 'Error'
                            })
                        );
                });

            }

        }
        
    }

}
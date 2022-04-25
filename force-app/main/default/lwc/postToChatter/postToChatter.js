import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import getObjSearchList from '@salesforce/apex/objSearchController.getObjSearchList'; 
import postRecords from '@salesforce/apex/objSearchController.postRecords';

export default class PostToChatter extends LightningElement {

    @api objName = 'Account';

     searchKey;
     records;
     selectedRecords;
     postMessage;
     error;

    isSearchChangeExecuted = false;
    isValidSearch = false;
    
    searchHeader;

    renderedCallback() 
    {
        this.searchHeader = this.objName + ' Searches';
        // This line added to avoid duplicate/multiple executions of this code.  
        if (this.isSearchChangeExecuted) {  
            return;  
        }
 
        this.isSearchChangeExecuted = true;
        getObjSearchList({ objName: this.objName, searchString: this.searchKey })  
        .then(objectList => {  
            this.populateData(objectList);   
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

    populateData(objectList) 
    {
        console.log('Json Result Record: ' + JSON.stringify(objectList));
        this.records = new Array();
        objectList.forEach(record => 
            {                
                var temprecord = JSON.parse(JSON.stringify(record));
                console.log('*** Before Record: ' + JSON.stringify(record)); 
                temprecord.Id_Link = '/' + record.Id;
                this.records.push(temprecord);
                console.log('*** After Record: ' + JSON.stringify(temprecord));
                
            });

        console.log('***records ' + this.records);

    }

    handleKeyChange(event) 
    {  
        if (this.searchKey !== event.target.value) {  
            this.isSearchChangeExecuted = false;
            this.searchKey = event.target.value;
            this.isValidSearch = false;
            if (this.searchKey)
                this.isValidSearch = true; 
            this.dispatchEvent(new CustomEvent('first'));   
        }  
    }

    handlePostMessage(event) 
    {  
        this.postMessage = event.target.value
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
        if (!this.postMessage){
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
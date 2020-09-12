/**
 * Class: cloneCampaignController
 *
 * Purpose: 
 *  
 * Where Referenced:
 * 
 *
 * Change History:
 *
 * Developer        Date            Description
 * -----------------------------------------------------------------------
 * Minh Ma          06/30/2020      Initial Development
 * MInh Ma          09/02/2020      Added cloneSelectedCampaigns
 */
public with sharing class cloneCampaignController 
{
    @AuraEnabled(cacheable = true)  
    public static List<Campaign> getCampaignsList(Integer pagenumber, 
                                                Integer numberOfRecords, 
                                                Integer pageSize, 
                                                String searchString) 
    {  
        String searchKey = '%' + searchString + '%';  
        String query = 'select id, Name, StartDate, Type, Status from Campaign ';  
        if (searchString != null && searchString != '') {  
            query += ' where name like \'%' + searchString + '%\' ';  
        }  
        query += ' order by name limit ' + pageSize + ' offset ' + (pageSize * (pagenumber - 1));
        System.Debug('***** ' + query);   
        return Database.query(query);  
    }
    
    
    @AuraEnabled(cacheable = true)  
    public static Integer getCampaignsCount(String searchString) 
    {  
        String query = 'select count() from Campaign ';  
        if (searchString != null && searchString != '') 
        {  
            query += ' where name like \'%' + searchString + '%\' ';  
        }  
        return Database.countQuery(query);  
    }


    @AuraEnabled()  
    public static string cloneSelectedCampaigns(List<campaign> selectedCampaigns) 
    {
        string action = 'Successfully Cloned...';
        List<campaign> CampaignsToClone = new List<Campaign>();

        if (!selectedCampaigns.isEmpty())
        {
            Savepoint sp = Database.setSavepoint();

            for (campaign oCampaign : selectedCampaigns)
            {
                campaign oCampaignToClone = oCampaign.clone(false, false, false, false);
                oCampaignToClone.Name = oCampaignToClone.Name + ' - Cloned';
                CampaignsToClone.Add(oCampaignToClone);
            }
            
            try
            {
                INSERT CampaignsToClone;
            }
            catch( Exception ex )
            {
                System.debug( 'CAMPAIGN CLONE FAILED : ' + ex.getMessage() );
                action = 'Campaign Clone Failed : ' + ex.getMessage();
                Database.rollback( sp );
            }

        }
        else 
        {
            action = 'Nothing to Clone...';
        }

        return action;  
    }

}
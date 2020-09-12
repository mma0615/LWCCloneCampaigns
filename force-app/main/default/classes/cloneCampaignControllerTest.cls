/**
 * Class: cloneCampaignControllerTest
 *
 * Purpose: cloneCampaignController Test Class
 *  
 * Where Referenced:
 * 
 *
 * Change History:
 *
 * Developer        Date            Description
 * -----------------------------------------------------------------------
 * Minh Ma          06/30/2020      Initial Development
 * Minh Ma          09/01/2020      Added cloneSelectedCampaignsTest
 */
@isTest
public with sharing class cloneCampaignControllerTest 
{
    @isTest static void getCampaignsListTest() 
    {
        List<Campaign> campaignToCreate = TestDataFactory.createCampaigns(20);

        // All Campaigns
        List<Campaign> campaignList = cloneCampaignController.getCampaignsList(1,20,10, null);
        System.assertEquals('List: 10', 'List: ' + campaignList.size());

        campaignList = cloneCampaignController.getCampaignsList(1,20,10, 'Test');
        System.assertEquals('List: 10', 'List: ' + campaignList.size());

    }

    @isTest static void getCampaignsCountTest() 
    {
        List<Campaign> campaignToCreate = TestDataFactory.createCampaigns(20);

        Integer countInt = cloneCampaignController.getCampaignsCount(null);
        System.assertEquals('Count: 20', 'Count: ' + countInt);

        countInt = cloneCampaignController.getCampaignsCount('Test');
        System.assertEquals('Count: 20', 'Count: ' +countInt);
    }


    @isTest static void cloneSelectedCampaignsTest() 
    {
        List<Campaign> campaignToCreate = TestDataFactory.createCampaigns(20);

        List<Campaign> campaignToCloneList = new List<Campaign>();
        string action = cloneCampaignController.cloneSelectedCampaigns(campaignToCloneList);
        System.assertEquals(action,'Nothing to Clone...');

        campaignToCloneList = [select id, name from Campaign limit 20];
        System.assertEquals(20,20);
        action = cloneCampaignController.cloneSelectedCampaigns(campaignToCloneList);
        System.assertEquals(action,'Successfully Cloned...');
    }


}

/**
 * Class: TestDataFactory
 *
 * Purpose: is to create test data for APEX test classes
 * 
 * Where Referenced:
 *   apex class: cloneCampaignControllerTest
 *
 * Change History:
 *
 * Developer        Date            Description
 * -----------------------------------------------------------------------
 * Minh Ma          06/30/2020      Initial Development - create Campaigns
 * 
 */
@isTest
public class TestDataFactory 
{
    public static List<Campaign> createCampaigns(Integer numOfRecs) 
    {
        List<Campaign> objectList = new List<Campaign>();
        
        for(Integer i=0; i<numOfRecs; i++) 
        {
            Campaign rec = new Campaign(Name='TestCampaign ' + i);
            objectList.add(rec);
        }
        insert objectList;
        
        return objectList;
    }
}
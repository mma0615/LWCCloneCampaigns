public with sharing class objSearchController {
    public objSearchController() {

    }

    @AuraEnabled(cacheable = true)  
    public static List<Object> getObjSearchList(String objName, 
                                                String searchString) 
    {  
        if (searchString == null)
        {
            System.Debug('***** Nothing'); 
            return null;
        }
        else {
            String searchKey = '%' + searchString + '%';  
            String query = 'select id, Name from ' + objName;  
            if (searchString != null && searchString != '') {  
                query += ' where name like \'%' + searchString + '%\' ';  
            }  
            query += ' order by name limit 100';
            System.Debug('***** ' + query);   
            return Database.query(query);  
        }
        
    }

    @AuraEnabled()  
    public static string postRecords(List<String> selectedRecords, String postMessage) 
    {
        System.Debug('***** selectedRecords: ' + selectedRecords); 
        string action = 'Message Successfully Posted...';
        if (!selectedRecords.isEmpty())
        {
            List<FeedItem> FeedItemList = new List<FeedItem>();
            for (String str : selectedRecords){
                FeedItem itm = new FeedItem();
                itm.ParentId = str;
                itm.Body = postMessage;
                FeedItemList.add(itm);
            }

            System.Debug('***** FeedItemList: ' + FeedItemList);
            if (FeedItemList.size() > 0)
                insert FeedItemList;
        }
        else 
        {
            action = 'No records selected for Posting...';
        }

        return action;  

    }

}

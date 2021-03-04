# INVEST
 Dashboard for Ally Invest

# Overview
This project is an application to aggregate and cleanly display Ally Invest account data across one or many of your accounts. Through locally hosted and maintained files you can aggregate non Ally Invest accounts to obtain a holistic view of your portfolio. 

# Getting Started
Follow the instructions to get started! 

1) Clone the repo files and host on a webserver that supports php such as a Raspberry Pi
2) Sign up for an Ally Invest account at https://ally.com/invest
3) Obtain access to the Ally Invest API. Login -> Tools -> API -> Create a new application -> Personal Investment app
4) Add your keys to “/api/api_keys.php”
5) Open your browser to the hosted webpage

# Local data storage
Three local data files are used. Alerts and Comments can be added/removed from the application UI. The Extra Accounts file not written to by the application. The repo contains some example data for reference.
 
* alerts.csv – data used for the alert/notification system. This does not integrate with any alerts actually setup in Ally Invest.
* comments.csv – data used for user added comments for any of your holdings. I find it helpful just to remind myself if “I like this stonk”
* extra_accounts.csv – data for account holdings of non Ally Invest accounts that you’d like to manually integrate into the Dashboard. To fully implement, you’d also need to add the accounts to the “SETUP_EXTRA_ACCOUNTS” section in the main “javascript.js” file.

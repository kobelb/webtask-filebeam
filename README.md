# Filebeam

POST us a file, and we'll give you a public link to download it!


Example using cURL:

`curl -X POST https://webtask.it.auth0.com/api/run/wt-brandon_kobel-gmail_com-0/filebeam --data-binary @filename.extension`


If you forget the syntax of POSTing files using cURL, you can use the following to get a reminder

`curl https://webtask.it.auth0.com/api/run/wt-brandon_kobel-gmail_com-0/filebeam`

## Why did you write this???

Recently, I've found myself SSH'ed into various machines where using SCP required me to not be lazy (using a jumpbox to connect to a cluster of machines). I really wanted some way to send files back to my physical computer, no matter the network topology.

# Development

## Create webtask
`npm run create -- --secret awsAccessKeyId="" --secret awsSecretAccessKey="" --secret awsRegion="" --secret awsBucket=""`

## Deploy webtask
`npm run deploy`


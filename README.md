# Deployment Instructions
This assessment was submitted by Sameer Bagga.

## Generate Front-end build
- Clone the project in local directory using `git clone https://github.com/sameerbagga/shyftlabs.git`
- open aterminal and navigate to shyftlabs/client directory
- create a build for front-end app using command - npm run build
- copy the generated build folder inside server directory

## DB setup
This assessmet is using PostgreSQL as the DB source. 
Install the DB and Import/Restore `database.sql` file found inside root directory. Instructions can be found in [PostgreSQL Backup/Restore](https://www.postgresql.org/docs/current/backup.html).

## ENV setup
Create new .env file inside shyftlabs/server directory taking reference from sample.env file.

## Run Server/App
- Install all dependencies inside server directory using command - npm install
- Run the server using command - node server.js
- Jump to browser and navigate to http://<server_ip>:<port_defined_in_env>
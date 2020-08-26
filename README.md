# Shardie (ShardBot)

Shardie is a multipurpose discord bot having a good set of features for logging actions without storing them anywhere other than on your server's specified channel.

Shardie supports only ID syntaxes for moderating actions so you cannot get them wrong by example: mentioning wrong person by accident.

Shardie also have some commands under a Fun category so there should not be boring moments with the bot. 

Shardie is currently highly in development so new set of features are coming in every week. (That means little downtimes here and there!)

# For Developers and Self Hosting

Shardie uses MongoDB as its database

```bash
# Install dependencies
npm install

# Import your API tokens
echo "DISCORD_API_TOKEN=secret" > .env 
echo "DATABASE_URL=secret" > .env 

# Start
npm start
```
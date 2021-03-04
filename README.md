<div align="center">
<p>
    <a href="https://discord.gg/TgHdvJd"><img src="https://img.shields.io/discord/413193536188579841?color=7289da&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/@tinypudding/firebase-discord-interactions"><img src="https://img.shields.io/npm/v/@tinypudding/firebase-discord-interactions.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/@tinypudding/firebase-discord-interactions"><img src="https://img.shields.io/npm/dt/@tinypudding/firebase-discord-interactions.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://www.patreon.com/JasminDreasond"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon" /></a>
</p>
<p>
    <a href="https://nodei.co/npm/@tinypudding/firebase-discord-interactions/"><img src="https://nodei.co/npm/@tinypudding/firebase-discord-interactions.png?downloads=true&stars=true" alt="npm installnfo" /></a>
</p>
</div>

# Firebase-Discord-Interactions
Use Firebase Database Realtime or static data to receivve your Discord Bot's commands from the command slash.

<hr/>

## Function Listener
This method is used within your HTTP request using the Express module.
Once your request and response is sent into the module, the entire process will be done automatically.

### req
The Request Value from the express app module.

### res
The Response Value from the express app module.

### options
The module settings will be defined here.

### options.errorCallback (Function)
The errors that happen in the module will appear here for you to send a response to the Discord Endpoint.

### options.invalidCommandCallback (Function)
If you receive an invalid command, it will be sent to this function.

### options.commands (Object)
All of your commands should be here. Each object Key must be a command ID or a command name.
All returned values are the same as the "options.invalidCommandCallback".

### app (Object / Optional)
JSON static data to get your bot data.

### options.firebase (Object / Optional)
JSON data from your Firebase you want to get your bot data through Firebase Database Realtime.

### options.appPath (String / Optional)
The Path of your Firebase Database Realtime where you is storing your bot data.

### options.bot (Discord.JS Client / Optional)
You can insert an active or inactive Discord.JS Client to be used in conjunction with the API. (Tested in the Discord.JS 12.5.1)

### options.varNames (Object / Optional)
Here you can change the name of the http queries that will be used in the URL of your Discord Interaction Endpoint.

### options.debug (Boolean / Optional)
Enable the debug log.

### options.actionNotifications (Boolean / Optional)
Disable Action Notifications in the Log.

### options.forceInvalidCommandCallback (Boolean / Optional)
All commands will always return to the Invalid Command method.

```js
// Get Function Listener Base
const functionListener = require('@tinypudding/firebase-discord-interactions/functionListener');

// Options
const options = {

    // Error Callback
    errorCallback: async function (req, res, code, message) {
        return res.json({ errorCode: code, message: message })
    },

    // Invalid Command
    invalidCommandCallback: function (result) {
        return result.reply('This command has no functionality!');
    },

    // Firebase
    firebase: {
        app: cfg.firebase,
        options: cfg.options
    },

    // Path
    appPath: 'apps',

    // Commands
    commands: commands,

    // Varnames
    varNames: varNames,

    // App
    app: app,

    // Bot
    bot: bot

};

// Start Module
functionListener(req, res, options);
```

## JSON Values
The JSON Value Examples

### commands
```js
const commands = {
    ping: function (result) {

        // Embed (Discord.JS API converted to normal JSON Vanilla from the official Discord Documentation)
        const Discord = require('discord.js');
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            .setURL('https://discord.js.org/')
            .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addField('Inline field title', 'Some value here', true)
            .setImage('https://i.imgur.com/wSTFkRM.png')
            .setTimestamp()
            .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png')
            .toJSON();

        // Reply (All JSON options explained in the official Discord Documentation can be placed here.)
        return result.reply({
            tts: false,
            content: 'Pong!',
            embed: embed
        })
        
        // Result
        .then(data => {
            console.log(result.interaction.id + ' was replied!');
            console.log(data);
        })
        
        // Error
        .catch(err => {
            console.log(result.interaction.id + ' returned a error!');
            console.error(err);
        });

    }
};
```

### varNames
```json
{
    "type": "type",
    "bot": "bot"
}
```

### app
```json
{
    "test": {
        "client_id": "",
        "public_key": "",
        "bot_token": ""
    }
}
```

<hr/>

## Command Callback
Both valid commands and invalid commands, you will receive the same values and methods to use when sending a response to the Discord Command Slash Endpoint.

### result.cfg
All the configurations that are being used in the module will appear here.

### result.interaction
All your interaction data is here.

### result.di
The module "discord-interactions" data.

### result.res
The vanilla Express Response.
It is recommended that you use only the methods: res.status | res.json

### result.reply
Place a string or an object with the JSON values that will be returned to the Discord Interaction Endpoint API.
(All JSON options explained in the official Discord Documentation can be placed here.)

### result.get
Quick systems to obtain values that are within your slash command.<br/>
```js
result.get.author() // return the message author.

result.get.user(optionName, forceBot); // return a promise with the mentioned user.
result.get.channel(optionName, forceBot); // return a promise with the mentioned channel.
result.get.role(optionName, forceBot); // return a promise with the mentioned role.
// forceBot will force the Discord.JS values from the mentioned value if you are using the Discord.JS with the module. The all data will be stored in the value "result.interaction.data.discordjs"

result.get.boolean(optionName); // return a boolean value.
result.get.integer(optionName); // return a integer value.
result.get.string(optionName); // return a string value.

result.get.subCommand(optionName); // return a subCommand value.
result.get.subCommandGroup(optionName, subCommandName, itemName); // return a subCommand group value. (Not Tested)
```

### result.types
Object of numbers with the option types for the value of "result.interaction.data[0].type".
```js
result.types.boolean;
result.types.channel;
result.types.integer;
result.types.role;
result.types.string;
result.types.user;
result.types.sub_command;
result.types.sub_command_group;
```

<hr/>

## Not tested.

### result.msg.delete
Delete the message.

### result.msg.edit
Send a json in the first argument to edit the message.
(All JSON options explained in the official Discord Documentation can be placed here.)

### result.newMsg
Send a json in the first argument to create a message.
(All JSON options explained in the official Discord Documentation can be placed here.)

<hr/>

## Gateway
You can use your bot through a Gateway of Discord Interactions with the Discord.JS module and the results will be the same as in the examples mentioned above. The only thing that will be changed is how to build the initial code.

```js
// Tiny Config
const tinyCfg = require('../../config.json');
const Discord = require('discord.js');
const bot = new Discord.Client({ autoReconnect: true });

// The Ready Message
bot.on('ready', () => { logger.log(`Bot Ready! ${bot.user.tag} (${bot.user.id})`); return; });

// Insert the Discord.JS Client into the Cfg Bot Value
tinyCfg.bot = bot;

// Error Callback
tinyCfg.errorCallback = function () {
    return;
};

// Invalid Command Callback
tinyCfg.invalidCommandCallback = function (result) {

    // Reply
    return result.reply('This command has no functionality!').then(data => {
        console.log(result.interaction.id + ' was replied!');
        console.log(data);
    }).catch(err => {
        console.log(result.interaction.id + ' returned a error!');
        console.error(err);
    });

};

// Command List
tinyCfg.commands = commands;

// Prepare Gateway
const interactionsGateway = require('@tinypudding/firebase-discord-interactions/functionListener/gateway');

// Start Interaction Gateway
interactionsGateway(tinyCfg, bot);

// Start the Discord.JS Gateway
bot.login('BOT_TOKEN');

```

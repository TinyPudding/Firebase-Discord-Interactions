module.exports = (appID, guildID, botToken) => {
    return (commandID, modID) => {
        return new Promise((resolve, reject) => {

            // Prepare Values
            if (typeof commandID === "string" || typeof commandID === "number") {

                // Config
                const tinyCfg = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bot ${botToken}`,
                    }
                };

                // Is Post
                if (Array.isArray(modID) || typeof modID === "string") {

                    // Prepare Perms
                    tinyCfg.method = 'PUT';
                    tinyCfg.body = { permissions: [] };
                    const _ = require('lodash');
                    if (!Array.isArray(modID)) { modID = [modID]; }
                    for (const item in modID) {

                        // Prepare Config
                        const permCfg = _.defaultsDeep({}, modID[item], {
                            id: '',
                            type: 1,
                            permission: true
                        });

                        // Insert Config
                        tinyCfg.body.permissions.push(permCfg);

                    }

                    // Body
                    tinyCfg.body = JSON.stringify(tinyCfg.body);

                }

                // Get
                else if (typeof modID === "undefined") { tinyCfg.method = 'GET'; }

                // Nope
                else {
                    reject(new Error('Invalid Mod Data!'));
                    return;
                }

                // JSON Fetch
                const JSONfetch = require('@tinypudding/puddy-lib/http/fetch/json');
                JSONfetch(`https://discord.com/api/v8/applications/${appID}/guilds/${guildID}/commands/${commandID}/permissions`, tinyCfg)
                    .then(resolve).catch(reject);

            }

            // Nope
            else { reject(new Error('Invalid Values!')); }

            // Complete
            return;

        });
    };
};
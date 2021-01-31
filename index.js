module.exports = function (data, app, isTest = false) {

    // Prepare Modules
    const _ = require('lodash');
    const objType = require('@tinypudding/puddy-lib/get/objType');
    const clone = require('clone');

    // Create Settings
    const tinyCfg = _.defaultsDeep({}, data, {
        path: '/',
        database: ''
    });

    // Script Base
    const discordCommandChecker = async (snapshot) => {

        // Prepare Data
        const apps = snapshot.val();

        // Exist Data
        if (objType(apps, 'object')) {

            // Prepare Bot DB
            const db = app.db.ref(tinyCfg.botPath);
            const getDBData = require('@tinypudding/firebase-lib/getDBData');
            const interactionsClient = require("@tinypudding/discord-slash-commands/client");

            // Key List
            const appKeys = { value: Object.keys(apps) };
            appKeys.length = appKeys.value.length;
            appKeys.count = appKeys.value.length;
            const extraList = [];

            // Read Apps
            await require('for-promise')({ data: appKeys.length }, function (index, fn, fn_error, extra) {

                // Complete FN
                const complete_fn = function () {

                    // Remove Count
                    appKeys.count--;

                    // Complete Cicle
                    if (appKeys.count <= 0) {

                        // FN
                        fn(true);

                        // Run Extra List
                        if (extraList.length > 0) {
                            for (const item in extraList) {

                                // Prepare Values
                                const newCommands = extraList[item].commands;
                                const deleteCommands = extraList[item].deleteCommands;

                                // Prepare Extra Clear
                                const extraClear = extra({ data: deleteCommands });

                                // Execute the extra for
                                extraList[item].extra.run(function (index, fn, fn_error) {

                                    console.log(newCommands[index]);

                                    /* Criar uma função que leia todos os comandos dentro do newCommands e faça uma comparação se ele existe no oldCommands. 
                                    Se a resposta for negativa, ele vai usar create, se for positiva, ele vai usar update. 
                                    Ambos os resultados vai remover ele da lista do removeCommands que vai ser efetuado no final do script. */

                                    // Run the Delete
                                    if (index >= newCommands.length) {
                                        extraClear.run(function (index, fn, fn_error) {

                                            /* Criar uma função que limpe todos os comandos do bot aqui. */

                                            // Complete
                                            fn();
                                            return;

                                        });
                                    }

                                    // Complete
                                    fn();
                                    return;

                                });

                            }
                        }

                    }

                    return;

                };

                // Read Token
                getDBData(db.child(appKeys.value[index]).child('token')).then(token => {

                    // Is a Token String
                    if (typeof token === "string") {

                        // App
                        const app = apps[appKeys.value[index]];

                        // Create Client
                        const client = new interactionsClient({
                            client_id: app.client_id,
                            bot_token: token
                        });

                        // list all your existing commands.
                        client.getCommands().then(oldCommands => {

                            // Is Array
                            if (Array.isArray(oldCommands)) {

                                // Delete List
                                const deleteCommands = clone(oldCommands);

                                // Exist Command List
                                if (objType(app.commands, 'object')) {

                                    // Exist Global Commands
                                    if (Array.isArray(app.commands.global)) {
                                        extraList.push({
                                            commands: app.commands.global,
                                            deleteCommands: deleteCommands,
                                            extra: extra({ data: app.commands.global })
                                        });
                                    }

                                    // Exist Private Guild Commands
                                    if (Array.isArray(app.commands.guilds)) {
                                        extraList.push({
                                            commands: app.commands.guilds,
                                            deleteCommands: deleteCommands,
                                            extra: extra({ data: app.commands.guilds })
                                        });
                                    }

                                }

                                // Complete
                                complete_fn(); return;

                            }

                            // Nope
                            else {
                                complete_fn(); return;
                            }


                        }).catch(err => {
                            logger.error(err); complete_fn(); return;
                        });

                    }

                    // Nope
                    else { complete_fn(); }

                    // Complete
                    return;

                }).catch(err => {
                    logger.error(err); complete_fn(); return;
                });

                // Complete
                return;

            });

            // Console Test
            console.log('Complete');

        }

        // Complete
        return;

    };

    // Logger
    let logger = null;
    try {
        logger = require('@tinypudding/firebase-lib/logger');
    } catch (err) {
        logger = console;
    }

    // Production
    if (!isTest) {

        // Prepare Functions
        let functions = null;
        try {
            functions = require('firebase-functions');
        } catch (err) {
            functions = null;
        }

        // Start Module
        if (functions) {

            // Prepare Base
            return functions.database.instance(tinyCfg.database).ref(tinyCfg.appPath).onWrite(discordCommandChecker);

        }

        // Nope
        else {
            return null;
        }

    }

    // Test Mode
    else {

        try {

            // Prepare Test DB
            const db = app.db.ref(tinyCfg.appPath);

            // Insert Value
            db.on("value", discordCommandChecker);

        } catch (err) {
            logger.error(err);
        }

    }

    // Complete
    return;

};
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

            // Delte Commands Script
            const deleteCommandsScript = function (commands, index, fn, fn_error) {

                /* Criar uma função que limpe todos os comandos do bot aqui. */
                console.log(commands[index]);

                // Complete
                fn();
                return;

            };

            // Read Apps
            await require('for-promise')({ data: appKeys.length }, function (index, fn, fn_error, extra) {

                // Complete FN
                const complete_fn = function () {

                    // Remove Count
                    appKeys.count--;

                    // Complete Cicle
                    if (appKeys.count <= 0) {

                        // Run Extra List
                        if (extraList.length > 0) {
                            for (const item in extraList) {

                                // Command Manager
                                if (extraList[item].type !== "deleteAll") {

                                    // Extra Clear
                                    const deleteCommands = extraList[item].deleteCommands;
                                    let extraClear = null;
                                    let existClear = (Array.isArray(deleteCommands) && deleteCommands.length > 0);
                                    if (existClear) {
                                        extraClear = extra({ data: deleteCommands });
                                    }

                                    // Prepare Values
                                    const type = extraList[item].type;
                                    const newCommands = extraList[item].commands;
                                    const guild_id = extraList[item].guild_id;
                                    const oldCommands = extraList[item].oldCommands;

                                    // Execute the extra for
                                    extraList[item].extra.run(function (index2, fn) {

                                        // Prepare Extra Clear
                                        const commandsFor = extra({ data: newCommands });
                                        commandsFor.run(function (index3, fn, fn_error) {

                                            // New Command
                                            const newCommand = newCommands[index3];

                                            // Set Editor Type to Create
                                            let editorType = 1;

                                            // Exist OLD Command
                                            if (oldCommands.find(command => command.name === newCommand.name)) {

                                                // Set Editor Type to Edit
                                                editorType = 2;

                                                /* Montar um sistema de verificador de hash para definir se é o mesmo valor ou se é um novo valor. */

                                            }

                                            console.log(type);
                                            console.log(oldCommands);
                                            console.log(newCommand);
                                            console.log(deleteCommands);
                                            console.log(guild_id);

                                            /* Criar uma função que leia todos os comandos dentro do newCommands e faça uma comparação se ele existe no oldCommands. 
                                            Se a resposta for negativa, ele vai usar create, se for positiva, ele vai usar update. 
                                            Ambos os resultados vai remover ele da lista do removeCommands que vai ser efetuado no final do script. */

                                            // Run the Delete (COLOCAR ISSO AQUI APENAS QUANDO TERMINAR DE INSERIR O COMANDO NOVO)
                                            if (existClear && index3 >= newCommands.length) {
                                                extraClear.run(function (index4, fn, fn_error) { return deleteCommandsScript(deleteCommands, index4, fn, fn_error); });
                                            }

                                            // Complete
                                            fn();
                                            return;

                                        });

                                        // Complete
                                        fn();
                                        return;

                                    });

                                }

                                // Delete All
                                else {
                                    const deleteCommands = extraList[item].deleteCommands;
                                    extraList[item].extra.run(function (index2, fn, fn_error) { return deleteCommandsScript(deleteCommands, index2, fn, fn_error); });
                                }

                            }
                        }

                        // Nope
                        else { fn(true); }

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

                                    // Exist Commands
                                    let existCommands = false;

                                    // Exist Global Commands
                                    if (Array.isArray(app.commands.global)) {
                                        existCommands = true;
                                        extraList.push({
                                            type: 'global',
                                            commands: app.commands.global,
                                            deleteCommands: deleteCommands,
                                            oldCommands: oldCommands,
                                            extra: extra({ data: app.commands.global })
                                        });
                                    }

                                    // Exist Private Guild Commands
                                    if (objType(app.commands.guilds, 'object')) {
                                        for (const item in app.commands.guilds) {
                                            if (Array.isArray(app.commands.guilds[item])) {
                                                existCommands = true;
                                                extraList.push({
                                                    type: 'guild',
                                                    guild_id: item,
                                                    root: app,
                                                    commands: app.commands.guilds[item],
                                                    oldCommands: oldCommands,
                                                    deleteCommands: deleteCommands,
                                                    extra: extra({ data: app.commands.guilds[item] })
                                                });
                                            }
                                        }
                                    }

                                    // No Commands
                                    if (!existCommands) {
                                        extraList.push({
                                            type: 'deleteAll',
                                            root: app,
                                            deleteCommands: deleteCommands,
                                            oldCommands: oldCommands,
                                            extra: extra({ data: deleteCommands })
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
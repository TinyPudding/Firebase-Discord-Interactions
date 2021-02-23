// Tiny Config
const tinyCfg = require('../../config.json');

// Error Callback
tinyCfg.errorCallback = function () {
    return;
};

// Invalid Command
tinyCfg.invalidCommandCallback = function (result) {

    // Debug
    console.log('Command Received!');
    console.log(result.data);
    
    // Reply
    return result.res.json({
        type: result.di.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            tts: false,
            content: 'This command has no functionality!'
        },
    }).then(data => {
        console.log(result.data.id + ' was replied!');
        console.log(data);
    }).catch(err => {
        console.log(result.data.id + ' returned a error!');
        console.error(err);
    });

};

// Invalid Command
tinyCfg.commands = {

    pudding: function (result) {

        // Debug
        console.log('Pudding Command Received!');
        console.log(result.data);
        
        // Reply
        return result.res.json({
            type: result.di.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                tts: false,
                content: 'Your pudding is here! 🍮'
            },
        }).then(data => {
            console.log(result.data.id + ' was replied with a pudding!');
            console.log(data);
        }).catch(err => {
            console.log(result.data.id + ' returned a error with a pudding!');
            console.error(err);
        });
    
    }

};

// Start Module
require('../../../functionListener/gateway')(tinyCfg, tinyCfg.gateway_test_token);
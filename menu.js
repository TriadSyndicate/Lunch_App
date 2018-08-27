//Redundant File
const app = require('./index.js');
const { IncomingWebhook } = require('@slack/client');
const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook("https://hooks.slack.com/services/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");

// Send simple text to the webhook channel
console.log(app.trigger);
function hook(text){

    webhook.send(text, function(err, res) {
        if (err) {
            console.log('Error:', err);
        } else {
            console.log('Message sent: ', res);
        }
    });
};
hook('hello2222ss');
const admin = require('firebase-admin');
const express = require('express');
var BodyParser = require('body-parser');
const app = express();
app.use(BodyParser());

var payload = "";
//const trigger="";
//WEBHOOK! :D
const { IncomingWebhook } = require('@slack/client');
const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook("https://hooks.slack.com/services/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");

function hook(text){

  webhook.send(text, function(err, res) {
      if (err) {
          console.log('Error:', err);
      } else {
          console.log('Message sent: ', res);
      }
  });
};


var serviceAccount = require('./servicekey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();

app.post('/api/triggers', (req,res) => {
   const trigger = {
      text: req.body.text,
      user_name: req.body.user_name,
      trigger_word: req.body.trigger_word
  };
var docRef = db.collection('slack').doc();
var setAda = docRef.set({
  user_name: req.body.user_name,
  trigger_word: req.body.trigger_word,
  text: trigger.text
});
if(trigger.trigger_word == 'menu')
{
  var food = db.collection('foods');
  var allfoods = food.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          var output = JSON.parse(JSON.stringify(doc.data()));   
          var format = "ID: "+output.food_id+ " " +output.food_name + " - Ksh."+ output.food_price + "\n";
          payload = payload + format;   
        });
          var menu = "";
          payload = payload + "*THIS IS THE MENU use: _order_: $ID, $ID ... to order*";
          menu = {"text": payload};
          payload = "";
          hook(menu);
          /*console.log(menu);
          res.json(menu);*/  
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
};

if(trigger.trigger_word == 'order')
{
  var val = trigger.text;
  var len = val.length;
  var tex = "";
  for(var i = 6; i < val.length;i++)
  {
    tex = tex + val[i];
  };
  for(var i = 0; i < tex.length;i++)
  {
    console.log(tex);
    console.log(tex.length);
  };
};

});
app.listen(3000, () => console.log('Listening on port 3000...'))


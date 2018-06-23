
// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

const AWSregion = 'us-east-1';  // us-east-1

const params = {
TableName: 'audioSounds',
Key:{ "location": 'Forest', "planet": "Earth" }
};

// TODO: now I need to have the location and planet be in dialog so that the user can say where they want to go

// TODO: I also need to bring back the audio stream starter template and implement the dynamo read function so that the user can active the specific sound urls from my S3 bucket

// 2. Skill Code =======================================================================================================

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

AWS.config.update({
region: AWSregion
});

exports.handler = function(event, context, callback) {
var alexa = Alexa.handler(event, context);

alexa.appId = 'amzn1.ask.skill.54254bd5-ee38-4b22-b662-325a632062c6';
// alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes

alexa.registerHandlers(handlers);
alexa.execute();
};

const handlers = {
'LaunchRequest': function () {
    this.response.speak('welcome to audio stream starter.  ask me a yes or no question.').listen('try again');
    this.emit(':responseReady');
    // TODO: I need to change up the speak response
},

'MyIntent': function () {

    // var MyQuestion = this.event.request.intent.slots.MyQuestion.value;
    // console.log('MyQuestion : ' + MyQuestion);

    readDynamoItem(params, myResult=>{
        var say = '';

        say = myResult;

        say = 'The answer is: ' + myResult; // TODO: I need to change this
        this.response.speak(say).listen('try again');
        this.emit(':responseReady');

    });

},
'AMAZON.HelpIntent': function () {
    this.response.speak('ask me a yes or no question.').listen('try again');
    this.emit(':responseReady');
},
'AMAZON.CancelIntent': function () {
    this.response.speak('Goodbye!');
    this.emit(':responseReady');
},
'AMAZON.StopIntent': function () {
    this.response.speak('Goodbye!');
    this.emit(':responseReady');
}
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================


function readDynamoItem(params, callback) {

var AWS = require('aws-sdk');
AWS.config.update({region: AWSregion});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log('reading item from DynamoDB table');

docClient.get(params, (err, data) => {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));

        callback(data.Item.url);  // this particular row has an attribute called message

    }
});

}

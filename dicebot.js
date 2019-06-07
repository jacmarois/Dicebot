//Load the token
var secrets = require('./secrets.json');
//Grab the token for login
var token = secrets.token;
//Load the Discord.js lib
var discord = require('discord.js');

//Create the client
const bot = new discord.Client({disableEveryone:true});

//This function only runs when the client logs in
bot.on('ready', async() =>{
	console.log('DiceBot is ready to roll!');
});

//Catch and print fatal errors and end the process
//Most commonly, unstable internet connections running
//A bot will throw a network error that disconnects the bot
//The best solution to this is to end the process and have
//It automatically restart using PM2
client.on('error', err => {
	console.error(err);
	process.exit(1);
});

//This function is called on every message
bot.on('message', function(message){
	//Ignore direct messages
	if(message.channel.type === 'dm') return;

	//Grab the first string before a whitespace
	var roll = message.content.toLowerCase().split(/ +/)[0];

	//If the string is a roll (ie: d6 or 2d6)
	if(roll.match(/^[2-9][0-9]*d[1-9][0-9]*$/)){
		//Split the numbers before and after the d
		let rollInfo = roll.split('d');
		let numDice = Number(rollInfo[0]);
		let dieType = Number(rollInfo[1]);

		let rollList = [];
		let sum = 0;

		for(var i = 0; i < numDice; i++){
			let rNum = Math.floor(Math.random() * dieType + 1);
			rollList.push(rNum);
			sum += rNum;
		}

		message.channel.send(`You rolled:\n${rollList.join('\n')}\nTotal: ${sum}`).then(msg => {
			msg.delete(30000);
		});

		message.delete(30000);
	} else if(roll.match(/^d[1-9][0-9]*$/) || roll.match(/^1d[1-9][0-9]*$/)){
		let numDice = 1;
		let dieType = Number(roll.slice(1));
		if(roll.match(/^1d[1-9][0-9]*$/)){
			dieType = Number(roll.slice(2));
		}

		let rollNum = 0;

		for(var i = 0; i < numDice; i++){
			let rNum = Math.floor(Math.random() * dieType + 1);
			rollNum = rNum;
		}

		message.channel.send(`You rolled:\n${rollNum}`).then(msg => {
			msg.delete(30000);
		});

		message.delete(30000);
	}

	return;
});

bot.login(token);
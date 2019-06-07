//Load the token
const secrets = require('./secrets.json');
//Grab the token for login
const token = secrets.token;
//Grab the prefix used for bot settings
const prefix = secrets.prefix;
//Determine whether or not the bot cleans up messages
//That it sends and the user uses to call it
var cleanchat = secrets.cleanchat;
//Load the Discord.js lib
const discord = require('discord.js');
//Load the fs lib for .json writing
const fs = require('fs');

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

	//Check if the message starts with the bot's prefix
	if(message.content.startsWith(prefix)){
		//Create an array of args from the message split at each space
		//(any number of connected whitespace chars) after removing
		//The prefix
		const args = message.content.slice(prefix.length).split(/ +/);
		//Grab the first arg (the command), remove it from the array, and convert to lowercase
		const cmd = args.shift().toLowerCase();

		//Enable or disable cleanchat
		if(cmd === 'cc'){
			//Just flip the boolean
			cleanchat = !cleanchat;

			//Load secrets.json for changing
			var scrts = JSON.parse(fs.readFileSync('./secrets.json'));

			//Change cleanchat in the .json
			scrts.cleanchat = cleanchat;

			//Save the new value to the .json
			let data = JSON.stringify(scrts,null,2);
      		fs.writeFile('./secrets.json',data,(err) =>{
         		if(err) console.log(err);
				console.log(`Clean chat: ${cleanchat ? 'ENABLED' : 'DISABLED'}`);
			});
			
			//Let the user know the state of clean chat
			if(!cleanchat){
				message.channel.send(`Clean chat: DISABLED`);
			}
			else{
				message.channel.send(`Clean chat: ENABLED`).then(msg => {
					msg.delete(30000);
				});

				message.delete(30000);
			}
		}
	}

	//Grab the first string before a whitespace
	var roll = message.content.toLowerCase().split(/ +/)[0];

	//If the string is a multi-dice roll (ie: 2d6, 6d6, etc.)
	if(roll.match(/^[2-9][0-9]*d[1-9][0-9]*$/)){
		//Split the number of dice to roll from the type of die to roll
		let rollInfo = roll.split('d');
		let numDice = Number(rollInfo[0]);
		let dieType = Number(rollInfo[1]);

		//Create an array to hold each roll
		let rollList = [];
		//We're also going to add up the roll to tell the user
		let sum = 0;

		for(var i = 0; i < numDice; i++){
			//Simulate a roll
			let rNum = Math.floor(Math.random() * dieType + 1);
			//Add the roll to the list
			rollList.push(rNum);
			//Add to the sum
			sum += rNum;
		}

		//Send the user the list of rolls and the summation of the rolls
		if(!cleanchat){
			message.channel.send(`You rolled:\n${rollList.join('\n')}\nTotal: ${sum}`);
		}
		else{
			message.channel.send(`You rolled:\n${rollList.join('\n')}\nTotal: ${sum}`).then(msg => {
				msg.delete(30000);
			});

			message.delete(30000);
		}
	//If the roll is a single die roll (d6, 1d6, etc.)
	} else if(roll.match(/^d[1-9][0-9]*$/) || roll.match(/^1d[1-9][0-9]*$/)){
		//Remove the first char (either 1 or d)
		let dieType = Number(roll.slice(1));
		//If the first char was 1, remove the second char: d
		if(roll.match(/^1/)){
			dieType = Number(roll.slice(2));
		}

		//Simulate a die roll
		let rollNum = Math.floor(Math.random() * dieType + 1);

		//Send the user the list of rolls and the summation of the rolls
		if(!cleanchat){
			message.channel.send(`You rolled:\n${rollNum}`);
		}
		else{
			message.channel.send(`You rolled:\n${rollNum}`).then(msg => {
				msg.delete(30000);
			});

			message.delete(30000);
		}
	}

	return;
});

bot.login(token);
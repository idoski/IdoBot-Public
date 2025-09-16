// IdoBotV2...
// imports SlashCommandBuilder for creating a new command
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
const { SlashCommandBuilder } = require('discord.js');
// module.exports makes the command readable by other files in the bot project.
module.exports = {
	// data provides command definition
	data: new SlashCommandBuilder()
		.setName('index-add')
		.setDescription('Adds to the index!')
		.addStringOption(option => option.setName('cardname') .setDescription('Enter the character name') .setRequired(true))
		.addStringOption(option => option.setName('cardcode') .setDescription('Enter the card code') .setRequired(true))
		.addIntegerOption(option => option.setName('cost') .setDescription('Price of the card (wists)') .setRequired(true))
		.addIntegerOption(option => option.setName('wishlists') .setDescription('Enter amount of wishlists the card has') .setRequired(true) .setMinValue(0))
		.addIntegerOption(option => option.setName('gen') .setDescription('Gen of the card, set to 0 if unscratched') .setRequired(true) .setMinValue(0) .setMaxValue(2000))
		.addBooleanOption(option => option.setName('special') .setDescription('Set to true if card is anything other than a regular 2D') .setRequired(true))
		.addStringOption(option => option.setName('comments') .setDescription('Specifics about the card, event, 3D, etc.')),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {
		const wishlists = interaction.options.getInteger('wishlists') ?? -1;
		const gen = interaction.options.getInteger('gen') ?? -1;
		const cname = interaction.options.getString('cardname') ?? 'null';
		const ccode = interaction.options.getString('cardcode') ?? 'null';
		const cost = interaction.options.getInteger('cost') ?? -1;
		const cmmt = interaction.options.getString('comments') ?? 'null';
	},
};
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
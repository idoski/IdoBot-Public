// IdoBotV2...
// imports SlashCommandBuilder for creating a new command
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
/* eslint-disable indent */
const { SlashCommandBuilder } = require('discord.js');
// module.exports makes the command readable by other files in the bot project.
module.exports = {
	// data provides command definition
	data: new SlashCommandBuilder()
		.setName('advanced-search')
		.setDescription('search the index for specific characters within a gen range')
		.addStringOption(option => option.setName('name') .setDescription('name of character you are searching for') .setRequired(true))
		.addBooleanOption(option => option.setName('special') .setDescription('include special cards?') .setRequired(true))
        .addIntegerOption(option => option.setName('maxgen') .setDescription('gen ceiling') .setRequired(true) .setMinValue(0) .setMaxValue(2000))
        .addIntegerOption(option => option.setName('mingen') .setDescription('gen floor') .setRequired(true) .setMinValue(0) .setMaxValue(2000))
		.addStringOption(option => option.setName('type') .setDescription('type what type of card to look for (i.e. 3D, morph, etc.) seperate w/ commas')),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {
		const ccode = interaction.options.getString('name') ?? 'null';
	},
};
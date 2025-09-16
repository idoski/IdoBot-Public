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
		.setName('points-redeem')
		.setDescription('redeem points')
        .addIntegerOption(option => option.setName('amount') .setDescription('amount to redeem | MULTIPLES OF 5!!!') .setRequired(true) .setMinValue(5)),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {
		const player = 1;
	},
};
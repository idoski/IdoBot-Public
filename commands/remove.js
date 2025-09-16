// IdoBotV2...
// imports SlashCommandBuilder for creating a new command
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
/* eslint-disable indent */
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
// module.exports makes the command readable by other files in the bot project.
module.exports = {
	// data provides command definition
	data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes a specific card from the index.')
		.addStringOption(option => option.setName('cardcode') .setDescription('Card to be removed.') .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {
		const ccode = interaction.options.getString('cardcode') ?? 'null';
	},
};
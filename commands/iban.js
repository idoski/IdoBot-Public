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
        .setName('iban')
        .setDescription('bans someone from the bot for a set amount of time.')
		.addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('length') .setDescription('length for ban (1h,4d,2w, etc)') .setRequired(true))
        .addStringOption(option => option.setName('timecode') .setDescription('hammertime timestamp for unban') .setRequired(true))
        .addStringOption(option => option.setName('reason') .setDescription('reason for ban') .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {
        const banned = interaction.options.getUser('target');
		console.log(interaction.user.username + ' has banned ' + banned.id);
	},
};
// Require the necessary discord.js classes
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
/* eslint-disable indent */
/* eslint-disable no-lonely-if */
const Page = require('./page.js');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Events, EmbedBuilder, ChannelType, ButtonBuilder, ButtonStyle } = require('discord.js');
const { token } = require('./config.json');
const mysql = require('mysql2');
const xlsx = require('xlsx');
const paginationEmbed = require('discordjs-button-pagination-v2');


// Opens mysql connection
const con = mysql.createPool({
	connectionLimit: 100,
	host: 'placeholder',
	user: 'placeholder',
	password: 'placeholder',
	database: 'placeholder',
});

con.getConnection(function(err) {
	if (err) throw err;
});


// Create a new client instance
const client = new Client({
	intents: [
		// Specifies Intents to use, in this case, all of them
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.commands = new Collection();

// Looks for command files by searching for a 'commands' folder.
// Checks dir for specifically .js files.
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Looks for event files using readddirSync.
// Checks dir for .js files specifically using the .filter thingy
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Event Listener
client.on(Events.InteractionCreate, async interaction => {
	const command = interaction.client.commands.get(interaction.commandName);
	// Checks if its a command.
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	else {
		// Start try catch loop for broken commands
		// Expand relevant command to see code
		try {
			await command.execute(interaction);
			const server = client.guilds.cache.get('1120469017631670372');
			const serverMember = server.members.fetch(interaction.user.id).then(() => true).catch(() => false);
			// Index Add Command
				// Checks if index add command
				if (interaction.commandName === 'index-add') {
					const userCheckPlayer = interaction.user.id;
					const userCheck = `SELECT * FROM playerdata WHERE playerid = ${mysql.escape(userCheckPlayer)}`;
					let banned = 0;
					con.query(userCheck, function(err, result) {
						try {
							if (result[0].banned == 1) {
								banned = 1;
							}
							else {
								banned = 0;
							}
							// Checks if banned
							if (banned == 1) {
								interaction.reply({ content: 'You are banned from the bot. If you believe this is an error, create a report on the Sofi Wall Street server (https://discord.gg/rB6jYZFqef)', ephemeral: true });
							}
							else {
								// Actual Command
								// Constants from the command...
								const gen = interaction.options.getInteger('gen') ?? 2000;
								const wishlists = interaction.options.getInteger('wishlists') ?? 0;
								const cname = interaction.options.getString('cardname') ?? 'bruh';
								const ccode = interaction.options.getString('cardcode') ?? 'bruh';
								const cost = interaction.options.getInteger('cost') ?? 0;
								const specialRaw = interaction.options.getBoolean('special') ?? false;
								let special = 0;
								let cmmt = interaction.options.getString('comments') ?? 'N/A';
								const indexCHL = client.channels.cache.find(channel => channel.id === '1120519549897408533');
								const lowGenCHL = client.channels.cache.find(channel => channel.id === '1121241969880989796');
								const highWishCHL = client.channels.cache.find(channel => channel.id === '1121241920241418261');
								if (specialRaw == true) {
									special = 1;
								}
								else {
									if (cmmt != 'N/A') {
										interaction.reply({ content: 'Cannot add a comment to a non-special card', ephemeral: true });
										cmmt = 'N/A';
									}
									special = 0;
								}
								// End Constants
								if (wishlists >= 100) {
									// Index Embed
									const indexEmbed = new EmbedBuilder()
										.setTitle ('Index Addition')
										.setAuthor ({ name: interaction.user.tag, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg`, url: 'https://discord.gg/TAFDe5FbCj' })
										.setDescription ('Card Name: ' + cname + '\n' + 'Card Code: ' + ccode + '\n' + 'Card Gen: ' + gen + '\n' + 'Cost: ' + cost + ' wists \n' + ' Special?: ' + special + '\n' + 'Comment: ' + cmmt)
										.setThumbnail ('https://i.imgur.com/MPwjr4e.png');
									// Send Embed
									indexCHL.send({ embeds: [indexEmbed] });
									// If gen is lower than 100, send to lowgen channel
									if (gen < 100) {
										lowGenCHL.send({ embeds: [indexEmbed] });
									}
									// If wishlists are greater than 1000, send to high wl channel
									if (wishlists >= 800) {
										highWishCHL.send({ embeds: [indexEmbed] });
									}
									// Date conversion
									const datetime = new Date();
									const actualDate = datetime.toISOString().split('T')[0] + ' ' + datetime.toTimeString().split(' ')[0];
									// SQL
									const sql = `INSERT INTO card_query (CardCode, CardName, CardGen, CardWishlists, CardCost, special, DateAdded, AddedBy, Comment) 
									VALUES (${mysql.escape(ccode)}, ${mysql.escape(cname)}, ${mysql.escape(gen)}, ${mysql.escape(wishlists)}, ${mysql.escape(cost)}, ${mysql.escape(special)}, ${mysql.escape(actualDate)}, ${mysql.escape(interaction.user.username)}, ${mysql.escape(cmmt)})`;
									// Query
									con.query(sql, function(err, result1) {
										try {
											console.log('Good');
										} catch (err) {
											console.error(err);
											interaction.reply({ content: 'No card found!', ephemeral: true });
										}
									});
									con.query(`UPDATE playerdata SET points = points + 1 WHERE playerid = ${mysql.escape(interaction.user.id)}`, function(err, result2) {
										if (err) throw err;
									});
									interaction.reply({ content: 'Done!', ephemeral: true });
								}
								// Not at least 100 WLs
								else {
									interaction.reply({ content: 'Too little wishlists!', ephemeral: true });
								}
							}
						} catch (err) {
									console.error(err);
									interaction.reply({ content: 'You must be registered to add cards!', ephemeral: true });
								}
					});
				}
			// Search Command
			if (interaction.commandName === 'search') {
				const ccode = interaction.options.getString('cardcode') ?? 'bruh';
				const sqlQ = 'SELECT * FROM card_query WHERE CardCode = ' + mysql.escape(ccode);
				con.query(sqlQ, function(err, result) {
					try {
						let sp = 'false';
						if (result[0].special == 1) {
							sp = 'true';
						}
						const record = `FOUND ***CARD ${result[0].CardCode}*** \n **__Name:__** ${result[0].CardName} \n **__Gen:__** ${result[0].CardGen} \n **__Wishlists @ Addition:__** ${result[0].CardWishlists} \n **__Cost:__** ${result[0].CardCost} wists
						\n **__Special?:__** ${sp} \n **__Added On:__** ${result[0].DateAdded} \n **__Added By__**: ${result[0].AddedBy} \n **__Comment:__** ${result[0].Comment}`;
						interaction.reply({ content: record });
					} catch (err) {
						console.error(err);
						interaction.reply({ content: 'No card found!', ephemeral: true });
					}
				});
			}
			// Remove command
			if (interaction.commandName === 'remove') {
				if (serverMember && interaction.guild.id === ('1120469017631670372') && interaction.member.roles.cache.has('1121275260457734146')) {
					// If banned
					if (interaction.member.roles.cache.has('1136445114835808286')) {
						interaction.reply({ content: 'You are banned from the bot. If you believe this is an error, create a report on the Sofi Wall Street server (https://discord.gg/rB6jYZFqef)', ephemeral: true });
					} else {
						// If not banned
						const ccode = interaction.options.getString('cardcode') ?? 'bruh';
						const sqlQ = 'DELETE FROM card_query WHERE CardCode = ' + mysql.escape(ccode);
						con.query(sqlQ, function(err, result) {
							try {
								interaction.reply({ content: `Card ${ccode} sucessfully removed!` });
								console.log(result);
							} catch (err) {
								console.error(err);
								interaction.reply({ content: 'No card found!', ephemeral: true });
							}
						});
					}
				} else {
					interaction.reply({ content: 'Only Sofi Wall Street Mods can remove cards, make a mistake? Go here --> (https://discord.gg/rB6jYZFqef)' });
				}
			}
			// Sheet command
			if (interaction.commandName === 'sheet') {
				const pass = interaction.options.getString('password') ?? 'null';
				const sheetCHL = client.channels.cache.find(channel => channel.id === '1121236780360937522') ?? '1120519606793162772';
				if (pass == 'null') {
					await interaction.reply('https://drive.google.com/drive/folders/1CHN5kyPiIqqLVMxv_fg6tXq90krlLaZw?usp=sharing');
				}
				else if (pass == 'mm7Zxx0p8!nqTTy') {
					con.query('SELECT * FROM card_query', (error, results) => {
						// (C1) EXTRACT DATA FROM DATABASE
						if (error) throw error;
						let data = [];
						results.forEach(row => {
							data.push([row['CardCode'], row['CardName'], row['CardGen'], row['CardWishlists'], row['CardCost'], row['special'], row['DateAdded'], row['AddedBy'], row['Comment']]);
						});
						// (C2) WRITE TO EXCEL FILE
						const worksheet = xlsx.utils.aoa_to_sheet(data),
							workbook = xlsx.utils.book_new();
						xlsx.utils.book_append_sheet(workbook, worksheet, 'Index');
						xlsx.writeFile(workbook, 'sheet.csv');
						sheetCHL.send({ content: 'Sheet :saluting_face: ', files: ['./sheet.csv'] });
						interaction.reply({ content: 'Converted!', ephemeral: true });
					});
				}
				else if (pass != 'mm7Zxx0p8!nqTTy') {
					await interaction.reply('Wrong Pass!');
				}
			}
			// Points command
			if (interaction.commandName === 'points') {
				const player = interaction.options.getUser('target');
				const sqlQ = `SELECT points FROM playerdata WHERE playerid = ${mysql.escape(player.id)}`;
				con.query(sqlQ, (error, result) => {
					if (error) throw error;
					interaction.reply({ content: `${player} has ${result[0].points} points` });
				});
			}
			// point-register command
			if (interaction.commandName === 'register') {
				if (serverMember && interaction.guild.id === '1120469017631670372') {
					const player = interaction.user.id;
					const sqlQ = `INSERT INTO playerdata (playerid, points) VALUES (${mysql.escape(player)}, 0) `;
					if (interaction.member.roles.cache.find(role => role.name === 'registered')) {
						await interaction.reply('Already registered!');
					}
					else {
						con.query(sqlQ, (error, result) => {
							if (error) throw error;
							interaction.reply({ content: `${interaction.user.username} has been registered to the point system!` });
						});
					}
				} else {
					await interaction.reply({ content: 'Cannot register outside the Sofi Wall Street Server! (https://discord.gg/rB6jYZFqef)', ephemeral: true });
				}
			}
			// Points remove command
			if (interaction.commandName === 'points-remove') {
				const player = interaction.options.getMember('target');
                const playerid = await player.roles.cache.has('1136220928666251325');
				const pToRemove = interaction.options.getInteger('points');
				const sqlQ = `UPDATE playerdata SET points = points - ${mysql.escape(pToRemove)} WHERE playerid = ${mysql.escape(player.id)}`;
				if (playerid && interaction.user.id === '99381001943257088') {
					con.query(sqlQ, (error, result) => {
						if (error) throw error;
						interaction.reply({ content: `${player} has lost ${pToRemove} succesfully!`, ephemeral: true });
					});
				} else {
					interaction.reply('Cannot remove from unregistered player!/ You\'re not Idoski!');
				}
			}
			// index ban command
			if (interaction.commandName === 'iban') {
				if (serverMember && interaction.guildId === '1120469017631670372' && interaction.member.roles.cache.has('1121275260457734146')) {
					const bannedMem = interaction.options.getMember('target');
					const bannedUser = interaction.options.getUser('target');
					const hammer = interaction.options.getString('timecode');
					const length = interaction.options.getString('length');
					const reason = interaction.options.getString('reason');
					const r = interaction.member.guild.roles.cache.find(role => role.name === 'bot banned');
					const bannedid = bannedMem.roles.cache.has('1136445114835808286');
					const staffid = bannedMem.roles.cache.has('1121275260457734146');
					const idoski = bannedMem.roles.cache.has('1121230421955461120');
					const banCHL = client.channels.cache.find(channel => channel.id === '1136554490774958100');
					const userCheckPlayer = bannedUser.id;
					const userCheck = `SELECT playerid FROM playerdata WHERE playerid = ${mysql.escape(userCheckPlayer)}`;
					let isUserBanned = false;
					con.query(userCheck, function(err, result) {
						try {
							if (result[0].banned == 1) {
								isUserBanned = true;
							}
						} catch (err) {
							console.error(err);
							interaction.reply({ content: 'User not registered!', ephemeral: true });
						}
					});
					if (isUserBanned) {
						interaction.reply({ content: 'Target player already banned!', ephemeral: true });
					}
					else if (idoski && interaction.user.id !== '99381001943257088') {
						interaction.reply({ content: `<@99381001943257088>! <@${interaction.user.id}> tried to ban you :skull:` });
					}
					else if (staffid && interaction.user.id !== '99381001943257088') {
						interaction.reply({ content: 'Only Idoski can index ban staff!', ephemeral: true });
					}
					else {
						console.log(bannedMem);
						const indexEmbed = new EmbedBuilder()
							.setTitle (`${bannedUser.username} for ${length}`)
							.setAuthor ({ name: bannedUser.id, iconURL: `https://cdn.discordapp.com/avatars/${bannedUser.id}/${bannedUser.avatar}.jpeg` })
							.setDescription (`User ${bannedUser.username} was banned for ${reason} and to be unbanned ${hammer}`)
							.setThumbnail ('https://i.imgur.com/W4n3yMV.png');
						let embed = await banCHL.send({ embeds: [indexEmbed] });
						const thread = await embed.startThread({
							name: `${bannedUser.username}`,
							type: ChannelType.PrivateThread,
							reason: 'ban',
						});
						const banSend = `UPDATE playerdata SET banned = 1 WHERE playerid = ${mysql.escape(bannedUser.id)}`;
						con.query(banSend, function(err, result) {
							try {
								console.log('done!');
							} catch (err) {
								console.error(err);
								interaction.reply({ content: 'Error!', ephemeral: true });
							}
						});
						await thread.members.add(bannedUser);
						await thread.members.add(interaction.user);
						await interaction.reply({ content: `${bannedUser.username} has been banned for ${length} succesfully!`, ephemeral: true });
					}
				} else {
					await interaction.reply({ content: 'Can\'t execute moderation commands outside wall street!', ephemeral: true });
				}
			}
			// index unban command
			if (interaction.commandName === 'iunban') {
				if (serverMember && interaction.guildId === '1120469017631670372' && interaction.member.roles.cache.has('1121275260457734146')) {
					const unbanned = interaction.options.getMember('target');
					const unbannedUser = interaction.options.getUser('target');
					const unbannedid = unbanned.roles.cache.has('1136445114835808286');
					const reason = interaction.options.getString('reason');
					const banCHL = client.channels.cache.find(channel => channel.id === '1136554490774958100');
					const modLog = client.channels.cache.find(channel => channel.id === '1121278252112171018');
					const userCheckPlayer = unbannedUser.id;
					const userCheck = `SELECT playerid FROM playerdata WHERE playerid = ${mysql.escape(userCheckPlayer)}`;
					let isUserBanned = true;
					con.query(userCheck, function(err, result) {
						try {
							if (result[0].banned == 0) {
								isUserBanned = false;
							}
						} catch (err) {
							console.error(err);
							interaction.reply({ content: 'User not registered!', ephemeral: true });
						}
					});
					if (isUserBanned) {
						await modLog.send({ content: `<@99381001943257088>, ${unbannedUser.username} has been unbanned for reason ${reason}!` });
						const thread = await banCHL.threads.cache.find(x => x.name === unbannedUser.username);
						await thread.setLocked(true);
						await thread.setArchived(true);
						const banSend = `UPDATE playerdata SET banned = 0 WHERE playerid = ${mysql.escape(unbannedUser.id)}`;
						con.query(banSend, function(err, result) {
							try {
								console.log('done!');
							} catch (err) {
								console.error(err);
								interaction.reply({ content: 'Error!', ephemeral: true });
							}
						});
						await interaction.reply({ content: 'Successfuly unbanned ' + unbannedUser.username, ephemeral: true });
					}
					else {
						await interaction.reply({ content: 'Target player isn\'t banned!', ephemeral: true });
					}
				} else {
					await interaction.reply({ content: 'Can\'t execute moderation commands outside wall street!', ephemeral: true });
				}
			}
            // Advanced Search Command
			if (interaction.commandName === 'advanced-search') {
				const name = interaction.options.getString('name') ?? 'null';
				const max = interaction.options.getInteger('maxgen') ?? '1';
				const min = interaction.options.getInteger('mingen') ?? '1';
				const special = interaction.options.getBoolean('special');
				const type = interaction.options.getString('type') ?? 'null';
				let sqlQ = 'null';
				if (min == max) {
					if (special == false) {
						if (type != 'null') {
							await interaction.reply({ content: 'Cannot use type with special set to false!', ephemeral: true });
						}
						sqlQ = 'SELECT * FROM card_query WHERE CardName LIKE ' + mysql.escape(`%${name}%`) + ' AND CardGen = ' + mysql.escape(min) + ' AND special = 0';
					}
					else if (special == true) {
						if (type != 'null') {
							sqlQ = 'SELECT * FROM card_query WHERE CardName LIKE ' + mysql.escape(`%${name}%`) + ' AND CardGen = ' + mysql.escape(min) + ' AND Comment LIKE ' + mysql.escape(`%${type}%`);
						}
						else {
							sqlQ = 'SELECT * FROM card_query WHERE CardName LIKE ' + mysql.escape(`%${name}%`) + ' AND CardGen = ' + mysql.escape(min);
						}
					}
				}
				else {
					if (special == false) {
						if (type != 'null') {
							await interaction.reply({ content: 'Cannot use type with special set to false!', ephemeral: true });
						}
						sqlQ = 'SELECT * FROM card_query WHERE CardName LIKE ' + mysql.escape(`%${name}%`) + ' AND CardGen <= ' + mysql.escape(max) + ' AND CardGen >= ' + mysql.escape(min) + ' AND special = 0';
					}
					else if (special == true) {
						if (type != 'null') {
							sqlQ = 'SELECT * FROM card_query WHERE CardName LIKE ' + mysql.escape(`%${name}%`) + ' AND CardGen <= ' + mysql.escape(max) + ' AND CardGen >= ' + mysql.escape(min) + ' AND Comment LIKE ' + mysql.escape(`%${type}%`);
						}
						else {
							sqlQ = 'SELECT * FROM card_query WHERE CardName LIKE ' + mysql.escape(`%${name}%`) + ' AND CardGen <= ' + mysql.escape(max) + ' AND CardGen >= ' + mysql.escape(min);
						}
					}
				}
				con.query(sqlQ, function(err, result) {
					try {
						let pages = [];
						let embedPages = [];
						let sum = 0;
						for (let i = 0; i < (result.length); i++) {
							sum += result[i].CardCost;
						}
						const pagesNeeded = Math.ceil(result.length / 10);
						const estimate = sum / result.length;
						let pageSpacing = 5;
						for (let i = 0; i < (pagesNeeded); i++) {
							let pageInfo = '';
							for (let j = (pageSpacing - 5); j < pageSpacing; j++) {
								pageInfo += `Code: ${result[j].CardCode} | Gen: ${result[j].CardGen} | Cost: ${result[j].CardCost} | Special? : ${result[j].special} \n`;
							}
							pages[i] = new Page.Page(i + 1, pageInfo);
						}
						for (let i = 0; i < pagesNeeded; i++) {
							embedPages[i] = new EmbedBuilder()
								.setTitle(`Found ${result.length} results`)
								.setDescription(pages[i].content + `\n **AVG PRICE:** ${estimate} wists`);
						}
						const button1 = new ButtonBuilder()
							.setCustomId('previousbtn')
							.setLabel('Previous')
							.setStyle(ButtonStyle.Danger);
						const button2 = new ButtonBuilder()
							.setCustomId('nextbtn')
							.setLabel('Next')
							.setStyle(ButtonStyle.Success);
						const buttons = [button1, button2];
						paginationEmbed(interaction, embedPages, buttons);

					} catch (err) {
						console.error(err);
						interaction.reply({ content: 'No cards found!', ephemeral: true });
					}
				});
			}
			// Size command
			if (interaction.commandName === 'size') {
				con.query('SELECT COUNT(*) AS count FROM card_query', (error, result) => {
					if (error) throw error;
					interaction.reply({ content: `Index currently has ${result[0].count} entries!` });
				});
			}
			// help command
			if (interaction.commandName === 'help') {
				const page1 = '/index-add - Add a card to the index \n /points - checks how many points someone has \n /register - register for card adding \n /remove - removes a card from the index \n /points-redeem - redeem points';
				const page2 = '/search - search for a specific card code in the index \n /advanced-search - search for a range of cards \n For more details, check in the shioribot discord.';
				const page3 = '/server - Gets a link to the ShioriBot server, Sofi Wall Street \n /sheet - Gets link to google sheet of the index, with password creates a .csv file. \n /help - Literally these embeds \n /size - Shows how big the index is!';
				const page4 = '/iban - bans a player from the bot and creates a ban thread for them. \n /iunban - unbans a player from the bot';
				const embed1 = new EmbedBuilder()
					.setTitle('Index System Commands')
					.setDescription(page1);
				const embed2 = new EmbedBuilder()
					.setTitle('Regular Commands')
					.setDescription(page2);
				const embed3 = new EmbedBuilder()
					.setTitle('Info Commands')
					.setDescription(page3);
				const embed4 = new EmbedBuilder()
					.setTitle('Moderation Commands')
					.setDescription(page4);
				const button1 = new ButtonBuilder()
					.setCustomId('previousbtn')
					.setLabel('Previous')
					.setStyle(ButtonStyle.Danger);
				const button2 = new ButtonBuilder()
					.setCustomId('nextbtn')
					.setLabel('Next')
					.setStyle(ButtonStyle.Success);
				const buttons = [button1, button2];
				const pages = [embed1, embed2, embed3, embed4];
				paginationEmbed(interaction, pages, buttons);
			}
			// Server command
			if (interaction.commandName === 'server') {
				interaction.reply({ content: 'Join the main server to contribute and earn wists! \n https://discord.gg/rB6jYZFqef' });
			}
			// Points Redeem command
			if (interaction.commandName === 'points-redeem') {
				const player = interaction.member;
                const playerid = await player.roles.cache.has('1136220928666251325');
				const pToRemove = interaction.options.getInteger('amount');
				let totalPoints = 0;
				const redeemCHL = client.channels.cache.find(channel => channel.id === '1168405357635305523');
				const sqlQ = `SELECT points FROM playerdata WHERE playerid = ${mysql.escape(interaction.user.id)}`;
				const sqlQ2 = `UPDATE playerdata SET points = points - ${mysql.escape(pToRemove)} WHERE playerid = ${mysql.escape(interaction.user.id)}`;
				const wists = pToRemove / 5;
				if (pToRemove % 5 != 0) {
					await interaction.reply({ content: 'Amount must be divisible by 5!' });
				}
				else if (playerid && pToRemove % 5 == 0) {
					con.query(sqlQ, (error, result) => {
						if (error) throw error;
						totalPoints = result[0].points - pToRemove;
					});
					if (totalPoints < 0) {
						interaction.reply({ content: 'Not enough points!' });
					}
					con.query(sqlQ2, (error, result) => {
						if (error) throw error;
						redeemCHL.send({ content: `<@99381001943257088>, <@${interaction.user.id}> has redeemed ${pToRemove} points for ${wists} wists!` });
						interaction.reply({ content: `Successfully redeemed ${pToRemove} points` });
					});
				}
				else {
					interaction.reply('You aren\'t registered!');
				}
			}
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
// Log in to Discord with your client's token
client.login(token);
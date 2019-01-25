const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '&';
const axios = require('axios');
const fs = require('fs');
const ms = require('ms');
const path = require('path');
const moment = require('moment');
const yt = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const getYTID = require('get-youtube-id');
const request = require('request');
const fetchVideoInfo = require('youtube-info');
const ytApiKey = 'AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8';
const youtube = new YouTube(ytApiKey);
const devs = ['202745501345382400', '461766920400535552', '202745501345382400', '461766920400535552', '202745501345382400', '202745501345382400'];

var cooldownGames = new Set();
var cooldownSurvival = new Set();
var cooldownSetName = new Set();

let queue = [];
let songsQueue = [];
let isPlaying = false;
let dispatcher = null;
let voiceChannel = null;
let skipRequest = 0;
let skippers = [];
let ytResultList = [];
let ytResultAdd = [];
let re = /^(?:[1-5]|0[1-5]|10)$/;
let regVol = /^(?:([1][0-9][0-9])|200|([1-9][0-9])|([0-9]))$/;
let youtubeSearched = false;
let selectUser;

client.on('ready', () => {
// عند بدء البوت راح يرسل السي ام دي هذي الرسايل
  console.log('')
  console.log('')
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log(`[Start] ${new Date()}`)
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log('')
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log('')
  console.log('╔[═════════════════]╗')
  console.log(' Bot Is Online')
  console.log('╔[═════════════════]╗')
  console.log('')
  console.log(`╔[ Logged in as * [ " ${client.user.username} " ] ]?`);
  console.log('')
  console.log('=[ Informations :]╗')
  console.log('')
  console.log(`╔[ Servers [ " ${client.guilds.size} " ]╗`);
  console.log(`╔[ Users [ " ${client.users.size} " ]╗`);
  console.log(`╔[ Channels [ " ${client.channels.size} " ]╗`);
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log('')
  console.log('')
  console.log('')
  client.user.setActivity('#Games')
});

client.on('message', message => {
	var args = message.content.split(' ');
	var args1 = message.content.split(' ').slice(1).join(' ');
	var args2 = message.content.split(' ')[2];
	var args3 = message.content.split(' ').slice(3).join(' ');
	var command = message.content.toLowerCase().split(" ")[0];
	var games = JSON.parse(fs.readFileSync('./games.json', 'utf8'));
	var muf = message.mentions.users.first();
	
	if(message.author.bot) return;
	if(message.channel.type === 'dm') return;
	
// كود تغيير الاسم والافتار وحالة اللعب
	if(command == prefix + 'setname') {
		let timecooldown = '1hour';
		if(!devs.includes(message.author.id)) return;
		if(cooldownSetName.has(message.author.id)) return message.reply(`**${ms(ms(timecooldown))}** يجب عليك الانتظار`);
		if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setname \`\`RezfixBot\`\``).then(msg => msg.delete(7000));
		if(args1 == client.user.username) return message.reply('**البوت مسمى من قبل بهذا الاسم**').then(msg => msg.delete(5000));
		
		cooldownSetName.add(message.author.id);
		client.user.setUsername(args1);
		message.reply(`\`\`${args1}\`\` **تم تغيير اسم البوت الى**`);
		
		setTimeout(function() {
			cooldownSetName.delete(message.author.id);
		}, ms(timecooldown));
	}
		if(command == prefix + 'setavatar') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setavatar \`\`Link\`\``).then(msg => msg.delete(7000));
			
			client.user.setAvatar(args1).catch(err => console.log(err)).then
			return message.reply('**حاول مرة اخرى في وقت لاحق**').then(msg => msg.delete(5000));
			
			let avatarbot = new Discord.RichEmbed()
			.setTitle(`:white_check_mark: **تم تغيير صورة البوت الى**`)
			.setImage(args1)
			.setTimestamp()
			.setFooter(`by: ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
			message.channel.send(avatarbot).then(msg => msg.delete(7000));
			message.delete();
		}
		if(command == prefix + 'setplay') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setplay \`\`www.Rezfix-Host.com\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1);
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة اللعب الى**`).then(msg => msg.delete(5000));
			message.delete();
		};
		if(command == prefix + 'setwatch') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setwatch \`\`www.Rezfix-Host.com\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1, { type: 'WATCHING' });
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة المشاهدة الى**`).then(msg => msg.delete(5000));
			message.delete();
		};
		if(command == prefix + 'setlisten') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setlisten \`\`www.Rezfix-Host.com\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1, { type: 'LISTENING' });
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة السماع الى**`).then(msg => msg.delete(5000));
			message.delete();
		};
	    if(command == prefix + 'setstream') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setstream \`\`www.Rezfix-Host.com\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1, 'https://www.twitch.tv/xiaboodz_');
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة البث الى**`).then(msg => msg.delete(5000));
			message.delete();
		};



// الالعاب
	if(!games[message.author.id]) games[message.author.id] = {
		laz: 0,
		fkk: 0,
		fast: 0,
		emoji: 0,
		flag: 0,
		math: 0,
	};
	
	if(command == prefix + 'لغز') {
		let type = require('./qlaz.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qLaz = new Discord.RichEmbed()
		.setTitle(':video_game: **[GAMES]** لديك 15 ثانيه فقط لتجيب على السؤال التالي')
		.setDescription(`اسرع واحد يقوم بحل اللغز التالي:\n\n➥ **${item.type}**`)
		.setThumbnail(client.user.avatarURL)
		.setColor('GRAY')
		.setTimestamp()
		.setFooter(`${prefix}points :لمعرفة نقاطك قم بكتابة الامر التالي`, client.user.avatarURL)
		
		message.channel.send(qLaz).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` لقد قمت بحل اللغز بالوقت المناسب, **مجموع نقاطك**`);
				games[won.id].laz++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بحل اللغز بالوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'فكك') {
		let type = require('./qfkk.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qFkk = new Discord.RichEmbed()
		.setTitle(':video_game: **[GAMES]** لديك 15 ثانيه فقط لتجيب على السؤال التالي')
		.setDescription(`اسرع واحد يقوم بتفكيك الجملة التالية:\n➥ **${item.type}**`)
		.setThumbnail(client.user.avatarURL)
		.setColor('GRAY')
		.setTimestamp()
		.setFooter(`${prefix}points :لمعرفة نقاطك قم بكتابة الامر التالي`, client.user.avatarURL)
		
		message.channel.send(qFkk).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` لقد قمت بتفكيك الكلمة بالوقت المناسب، **مجموع نقاطك**`);
				games[won.id].fkk++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بتفكيك الكلمة بالوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'اسرع-كتابة') {
		let type = require('./qfast.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qFast = new Discord.RichEmbed()
		.setTitle(':video_game: **[GAMES]** لديك 10 ثواني فقط لتجيب على السؤال التالي')
		.setDescription(`اسرع واحد يكتب الجملة التالية:\n\n➥ **${item.type}**`)
		.setThumbnail(client.user.avatarURL)
		.setColor('GRAY')
		.setTimestamp()
		.setFooter(`${prefix}points :لمعرفة نقاطك قم بكتابة الامر التالي`, client.user.avatarURL)
		
		message.channel.send(qFast).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 10000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` لقد قمت بكتابة الجملة بالوقت المناسب، **مجموع نقاطك**`);
				games[won.id].fast++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بكتابة الجملة بالوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'ايموجي') {
		let type = require('./qemoji.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qEmoji = new Discord.RichEmbed()
		.setTitle(':video_game: **[GAMES]** لديك 15 ثانيه فقط لتجيب على السؤال التالي')
		.setDescription(`اسرع واحد يقوم بكتابة اسم الايموجي التالي:`)
		.setImage(item.type)
		.setThumbnail(client.user.avatarURL)
		.setColor('GRAY')
		.setTimestamp()
		.setFooter(`${prefix}points :لمعرفة نقاطك قم بكتابة الامر التالي`, client.user.avatarURL)
		
		message.channel.send(qEmoji).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` لقد قمت بكتابة اسم الايموجي بالوقت المناسب، **مجموع نقاطك**`);
				games[won.id].emoji++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بكتابة اسم الايموجي بالوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'علم') {
		let type = require('./qflag.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qFlag = new Discord.RichEmbed()
		.setTitle(':video_game: **[GAMES]** لديك 15 ثانيه فقط لتجيب على السؤال التالي')
		.setDescription(`اسرع واحد يقوم بكتابة اسم العلم التالي:`)
		.setImage(item.type)
		.setThumbnail(client.user.avatarURL)
		.setColor('GRAY')
		.setTimestamp()
		.setFooter(`${prefix}points :لمعرفة نقاطك قم بكتابة الامر التالي`, client.user.avatarURL)
		
		message.channel.send(qFlag).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` لقد قمت بكتابة اسم العلم بالوقت المناسب، **مجموع نقاطك**`);
				games[won.id].flag++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بكتابة اسم العلم بالوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'رياضيات') {
		let type = require('./qmath.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qMath = new Discord.RichEmbed()
		.setTitle(':video_game: **[GAMES]** لديك 10 ثواني فقط لتجيب على السؤال التالي')
		.setDescription(`اسرع واحد يحسب المعادلة التالية:\n\n➥ **${item.type}**`)
		.setThumbnail(client.user.avatarURL)
		.setColor('GRAY')
		.setTimestamp()
		.setFooter(`${prefix}points :لمعرفة نقاطك قم بكتابة الامر التالي`, client.user.avatarURL)
		
		message.channel.send(qMath).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 10000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` **لقد قمت بحساب المعادلة بشكل صحيح بالوقت المناسب، مجموع نقاطك**`);
				games[won.id].math++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بحساب المعادلة في الوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'points') {
		if(!games[message.author.id]) games[message.author.id] = {
			laz: 0,
			fkk: 0,
			fast: 0,
			emoji: 0,
			flag: 0,
			math: 0,
		};
		
		if(args1 == '') {
			var lazPoints = games[message.author.id].laz;
			var fkkPoints = games[message.author.id].fkk;
			var fastPoints = games[message.author.id].fast;
			var emojiPoints = games[message.author.id].emoji;
			var flagPoints = games[message.author.id].flag;
			var mathPoints = games[message.author.id].math;
			var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
			var playerName = message.author.tag;
			var playerAvatar = message.author.avatarURL;
		}else {
			if(!games[muf.id]) games[muf.id] = {
				laz: 0,
				fkk: 0,
				fast: 0,
				emoji: 0,
				flag: 0,
				math: 0,
			};
			
			var lazPoints = games[muf.id].laz;
			var fkkPoints = games[muf.id].fkk;
			var fastPoints = games[muf.id].fast;
			var emojiPoints = games[muf.id].emoji;
			var flagPoints = games[muf.id].flag;
			var mathPoints = games[muf.id].math;
			var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
			var playerName = muf.tag;
			var playerAvatar = muf.avatarURL;
		}
		
		let pointsPlayer = new Discord.RichEmbed()
		.setTitle(':video_game: **[GAMES]** نقاط الالعاب')
		.setThumbnail(client.user.avatarURL)
		.setColor('GRAY')
		.setDescription(`**\n:heavy_plus_sign: [ مجموع النقاط [ ${allPoints}\n**`)
		.addField('**نقاط لعبة الالغاز:**', `➥ [ **${lazPoints}** ]`, true)
		.addField('**نقاط لعبة فكك:**', `➥ [ **${fkkPoints}** ]`, true)
		.addField('**نقاط لعبة اسرع كتابة:**', `➥ [ **${fastPoints}** ]`, true)
		.addField('**نقاط لعبة الايموجي:**', `➥ [ **${emojiPoints}** ]`, true)
		.addField('**نقاط لعبة الاعلام:**', `➥ [ **${flagPoints}** ]`, true)
		.addField('**نقاط لعبة الرياضيات:**', `➥ [ **${mathPoints}** ]`, true)
		.setTimestamp()
		.setFooter(playerName, playerAvatar)
		
		message.channel.send(pointsPlayer);
		
		fs.writeFile("./games.json", JSON.stringify(games), (err) => {
			if(err) console.error(err)
		});
	};
});


      client.on("message", message => {
    if (message.content.toLowerCase() === prefix + "مساعدة") {
        message.delete(5000)
        if(!message.channel.guild) return;
        const e = new Discord.RichEmbed()
        .setColor('#36393e')
        .setTitle('Check Your DM’s | انظر الى الخاص')
     const embed = new Discord.RichEmbed()
         .setColor('#36393e')
         .setTitle('')
         .setURL('')
         .setDescription(`
 **
الأوامر | Commands

البرفكس الخاص بالبوت [ # ] Bot Prefix

لعرض النقاط الخاصة بك [ #points - #نقاطي ] To display your points

قائمة المتصدرين للسيرفر [ #top - #توب ] Guild Leaderboard ( قريبا | Comming Soon )

قائمة المتصدرين في كافة السيرفرات [ #gtop - #الأفضل ] Global Leaderboardoard ( قريبا | Comming Soon )

Number of games [ 10 ] عدد الألعاب

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

الألعاب

#فكك | #spelling

#سرعه | #type

#عواصم | #captials

#لغز | #puzzle

#سؤال | #question ( قريبا | Comming Soon )

#ايموجي | #emoji

#علم | #flags

#ترجم | #translate ( قريبا | Comming Soon )

#اعكس | #reverse ( قريبا | Comming Soon )

#احسب | #maths

#انمي | #anime

#pubg | ببجي

سيرفر الرئيسي | Offical Server [  ]

سيرفر الدعم الفني | Support Server [ :support: ]

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

مبرمج البوت | Developers

[ <@202745501345382400> ]

:copyright: 2018 كودز | Codes

[ We will support fully English language Coming soon ]
 **
`)
   message.channel.send(e).then(m => m.delete(5000))
   message.author.sendEmbed(embed).catch(error => message.reply(':cry: Your DM’s is CLosed | خاصك مغلق :cry:'))
   
   }
   });

   
      client.on("message", message => {
    if (message.content.toLowerCase() === prefix + "مساعده") {
        message.delete(5000)
        if(!message.channel.guild) return;
        const e = new Discord.RichEmbed()
        .setColor('#36393e')
        .setTitle('Check Your DM’s | انظر الى الخاص')
     const embed = new Discord.RichEmbed()
         .setColor('#36393e')
         .setTitle('')
         .setURL('')
         .setDescription(`
 **
الأوامر | Commands

البرفكس الخاص بالبوت [ # ] Bot Prefix

لعرض النقاط الخاصة بك [ #points - #نقاطي ] To display your points

قائمة المتصدرين للسيرفر [ #top - #توب ] Guild Leaderboard ( قريبا | Comming Soon )

قائمة المتصدرين في كافة السيرفرات [ #gtop - #الأفضل ] Global Leaderboardoard ( قريبا | Comming Soon )

Number of games [ 10 ] عدد الألعاب

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

الألعاب

#فكك | #spelling

#سرعه | #type

#عواصم | #captials

#لغز | #puzzle

#سؤال | #question ( قريبا | Comming Soon )

#ايموجي | #emoji

#علم | #flags

#ترجم | #translate ( قريبا | Comming Soon )

#اعكس | #reverse ( قريبا | Comming Soon )

#احسب | #maths

#انمي | #anime

#pubg | ببجي

سيرفر الرئيسي | Offical Server [  ]

سيرفر الدعم الفني | Support Server [ :support: ]

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

مبرمج البوت | Developers

[ <@202745501345382400> ]

:copyright: 2018 كودز | Codes

[ We will support fully English language Coming soon ]
 **
`)
   message.channel.send(e).then(m => m.delete(5000))
   message.author.sendEmbed(embed).catch(error => message.reply(':cry: Your DM’s is CLosed | خاصك مغلق :cry:'))
   
   }
   });
   
client.on('message', message => {
      if(message.author.bot) return;
if (message.content.startsWith(prefix + 'توب')) {
    let _top = 1;
     let topp = Object.values(points);
 let top = topp.slice(0, 10).map(users => `**\`.${_top++}\` <@${users.id}> \`| ${users.points}\`**`).sort((a, b) => a > b).join('\n');
    const prefixlor = new Discord.RichEmbed()
      .setTitle("LeaderBoard")
      .setAuthor(client.user.username, client.user.avatarURL)
      .setDescription(top,true)
      .setColor('#36393e')
   
  	message.channel.sendEmbed(prefixlor)
}
  
});
client.login(process.env.BOT_TOKEN);

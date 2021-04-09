const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const client = new Discord.Client();

var reaction_role_msg = '829871867455602750';
var reaction_role_channel = '813477000521580544';

client.on("ready", () => {
    console.log("I am ready !");
});

client.on("message", (message) => {
    if (message.content.startsWith("ping")) {
        message.channel.send("pong!");
    }
});

client.on('message', async function (message) {
    if (message.content.toLowerCase().startsWith('*sagen')) {
        var sending = message.content.split(" ").slice(1).join(' ');
        message.delete();
        console.log(`Sent a message from ${message.author.username} : ` + sending);
        if (sending.toLocaleLowerCase().match("sitpi")) {
            message.reply("Parle mieux du boss !");
            return;
        }
        message.channel.send(sending);
        return;
    }
})

function sendAllChannnels (message) {
    client.channels.fetch('827997613281771541').then(Channel => {Channel.send(message)})
    client.channels.fetch('827998361017516052').then(Channel => {Channel.send(message)})
    client.channels.fetch('827999312645455902').then(Channel => {Channel.send(message)})
    client.channels.fetch('828000683185143851').then(Channel => {Channel.send(message)})
    client.channels.fetch('828001133989330955').then(Channel => {Channel.send(message)})
    client.channels.fetch('828001728309493851').then(Channel => {Channel.send(message)})
    client.channels.fetch('828002029204930631').then(Channel => {Channel.send(message)})
}

// Timer
client.on('message', async function (message) {
    if (message.content.toLowerCase().startsWith('*timer')) {
        let args = message.content.substring(1).split(" ")
        var countDownDate = new Date(new Date().getTime() + (args[1] * 60000));
        console.log(countDownDate);
        sendAllChannnels("C'est parti pour " + args[1] + " minutes ! Bon courage à tous ! 💪");
        var x = setInterval(function () {
            var now = new Date().getTime();

            var distance = Math.floor((countDownDate - now)/1000);

            if (distance == (60 * 30)) {
                sendAllChannnels("Plus que 30 minutes ! ⏰");
            }

            if (distance == (60 * 15)) {
                sendAllChannnels("Plus que 15 minutes ! ⏲");
            }

            if (distance == (60 * 10)) {
                sendAllChannnels("Plus que 10 minutes ! 🕙");
            }

            if (distance == (60 * 5)) {
                sendAllChannnels("Plus que 5 minutes ! ⏱");
            }

            if (distance == 60) {
                sendAllChannnels("Plus qu'une minute ! ⌚");
            }
            if (distance < 0) {
                clearInterval(x);
                sendAllChannnels("C'est fini 🔥😎, rejoignez-nous dans le salon #Coruscant 🌑");
            }
        }, 1000);
    }
})



// Radio C3P0
var servers = {}
var voiceConnection = null;
var broadcastDispatcher;
var musicQueue = [];

client.on('message', async message => {

    if (message.author.bot)
        return;

    if (!message.content.startsWith('*'))
        return;

    let args = message.content.substring(1).split(" ")

    switch (args[0]) {
        case 'play':
            async function play(connection, message) {
                var server = servers[message.guild.id]

                var broadcast = client.voice.createBroadcast();
                broadcastDispatcher = broadcast.play(ytdl(musicQueue[0], { filter: 'audioonly' }));
                server.dispatcher = connection.play(broadcast);

                ytdl.getInfo(musicQueue[0], function (err, info) {
                    const embed = new Discord.MessageEmbed().setAuthor(info.title, client.user.displayAvatarURL)
                        .setDescription("C'est tout de suite sur TurboRadio ⏯️ ")
                    message.channel.send("BOT : Lancement de la Musique")
                    message.channel.send(embed);
                }).catch((error) => {
                    message.channel.send("Je change de musique, mais j'ai bugué et je peux pas te donner le titre 😦");
                    message.channel.send("BOT : ytdl bug")

                    console.error(error, 'Promise error');
                });

                musicQueue.shift();
                musicQueue = musicQueue;
                broadcastDispatcher.on('speaking', function () {
                    if (musicQueue[0]) {
                        message.channel.send("BOT : Play")
                        play(connection, message);
                    } else {
                        broadcastDispatcher.end();
                        message.member.voice.channel.leave();
                        voiceConnection = null;
                    }
                })
            }

            if (!message.member.voice.channel) {
                message.reply('Tu n\'es pas dans un channel vocal 😦')
                console.log('ERROR play : sans channel vocal')
                return;
            }

            musicQueue = [
                'https://www.youtube.com/watch?v=V7yqW64Dx7c', // The Mandalorian - Soundtrack [Theme Song]
                'https://www.youtube.com/watch?v=xlYCxbBZUCY', // John Williams - Duel of the Fates (Star Wars Soundtrack) [HQ]
                'https://www.youtube.com/watch?v=Y7vJVKsDfn4', // Cantina Band
                'https://www.youtube.com/watch?v=-bzWSJG93P8', // Star Wars- The Imperial March (Darth Vader's Theme)
                'https://www.youtube.com/watch?v=_MXi3qt-wOY', // Anakin vs Obi-wan and Yoda VS Sidious.
            ]

            if (voiceConnection == null) {
                message.member.voice.channel.join().then(function (connection) {
                    voiceConnection = connection;
                    play(connection, message);
                    message.channel.send("Lancement de la radio")
                }).catch((error) => {
                    console.error(error, 'Promise error');
                });
            }
            break;

        case 'skip':
            var server = servers[message.guild.id];
            message.channel.send("Musique Suivante !  ➡️  🎵")
            console.log('BOT : Musique Suivante')
            if (broadcastDispatcher) broadcastDispatcher.end();
            break;

        case 'stop':
            var server = servers[message.guild.id];
            if (voiceConnection != null) {
                for (var i = musicQueue.length - 1; i >= 0; i--) {
                    server.queue.splice(i, 1);
                }
                for (var i = musicQueue.length - 1; i >= 0; i--) {
                    musicQueue.splice(i, 1);
                }
                broadcastDispatcher.end();
                voiceConnection = null;
                message.channel.send("L'Empire arrive ! Arrêtez la musique 🎵")
                console.log('BOT : Musique Arrêté')
            }
            if (!message.guild.connection) message.member.voice.channel.leave();
            break;
    }
})

client.on('message', async function (message) {
    
    if (message.content.toLowerCase().startsWith('*reaction_role')) {
        const channel = message.channel;
        msg = "Bonjour à tous,\n\nBienvenue sur le server Epitech Paris - Challenge Lycée.\n\nAfin de vous permettre d'accéder à tous les salons nous vous proposons de vous attribuer un rôle en réagissant au message :\n\n<:mandalorian:828282697641230416>  : `si vous êtes professeur`\n\n<:babyyoda:828279420069740585>  : `si vous êtes lycéen`\n\nBon challenge à tous."
        babyyoda_emoji = "828279420069740585"
        mandalorian_emoji = "828282697641230416"
        message.delete();
        let embed = new Discord.MessageEmbed()
            .setColor('#e42643')
            .setTitle('Que la force soit avec vous !')
            .setDescription(msg);
        channel.send(embed).then(post => {
          post.react(mandalorian_emoji)
          post.react(babyyoda_emoji)
        })
        
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    lycee_role = reaction.message.guild.roles.cache.find(role => role.name === "Lycéen");
    prof_role = reaction.message.guild.roles.cache.find(role => role.name === "Professeur");
    if (user.bot) return;
    if (!reaction.message.guild) return;
    console.log(reaction.message.channel.id)
    console.log(reaction_role_channel)
    if (reaction.message.channel.id == reaction_role_channel) {
        if (reaction.emoji.id === mandalorian_emoji) {
            if (!reaction.message.guild.members.cache.get(user.id).roles.cache.some(r => r.name === "Lycéen"))
                await reaction.message.guild.members.cache.get(user.id).roles.add(prof_role);
        }
        if (reaction.emoji.id === babyyoda_emoji) {
            if (!reaction.message.guild.members.cache.get(user.id).roles.cache.some(r => r.name === "Professeur"))
                await reaction.message.guild.members.cache.get(user.id).roles.add(lycee_role);
        }
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    lycee_role = reaction.message.guild.roles.cache.find(role => role.name === "Lycéen");
    prof_role = reaction.message.guild.roles.cache.find(role => role.name === "Professeur");
    if (user.bot) return;
    if (!reaction.message.guild) return;
    console.log(reaction.message.channel.id)
    console.log(reaction_role_channel)
    if (reaction.message.channel.id == reaction_role_channel) {
        if (reaction.emoji.id === mandalorian_emoji) {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(prof_role);
        }
        if (reaction.emoji.id === babyyoda_emoji) {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(lycee_role);
        }
    }
});

client.login("ODI4MDI5MDA0NTk4MzQ1NzI5.YGjoGg.UuNHrR3Scf4DaDDtCvXAQLnnRUw");
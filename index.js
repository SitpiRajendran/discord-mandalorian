const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const client = new Discord.Client();

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

client.login("ODI4MDI5MDA0NTk4MzQ1NzI5.YGjoGg.UuNHrR3Scf4DaDDtCvXAQLnnRUw");
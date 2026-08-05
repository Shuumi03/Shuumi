const {
    getServer
} = require('../config/serverConfig');

const {
    liveMonitors,
    createMonitorKey,
    createStopEmbed,
    saveLiveMonitors
} = require('./live');


// ======================================================
// COMMAND .STOP
// ======================================================

module.exports = {

    name: 'stop',


    async execute(
        message,
        args
    ) {

        // ==================================================
        // CEK FORMAT
        // ==================================================

        if (
            args.length < 2
        ) {

            return message.reply(

                'Format command salah.\n\n' +

                'Gunakan:\n' +

                '`.stop <Server> <Nama_Player>`\n\n' +

                'Contoh:\n' +

                '`.stop satumimpi umc`\n' +

                '`.stop sm umc`'

            );

        }


        // ==================================================
        // SERVER INPUT
        // ==================================================

        const serverInput =
            args[0];


        // ==================================================
        // NAMA PLAYER
        // ==================================================

        const playerName =

            args

                .slice(1)

                .join(' ')

                .trim();


        // ==================================================
        // CARI SERVER
        // ==================================================

        const server =

            getServer(

                serverInput

            );


        if (
            !server
        ) {

            return message.reply(

                `❌ Server **${serverInput}** tidak ditemukan.`

            );

        }


        // ==================================================
        // BUAT MONITOR KEY
        // ==================================================

        const monitorKey =

            createMonitorKey(

                message.guild.id,

                server.alias,

                playerName

            );


        // ==================================================
        // CARI MONITORING
        // ==================================================

        const monitor =

            liveMonitors.get(

                monitorKey

            );


        // ==================================================
        // JIKA TIDAK DITEMUKAN
        // ==================================================

        if (
            !monitor
        ) {

            return message.reply(

                `❌ Live monitoring untuk ` +

                `**${playerName}** ` +

                `di server **${server.name}** ` +

                `tidak ditemukan.`

            );

        }


        try {

            // ==================================================
            // HENTIKAN INTERVAL
            // ==================================================

            if (
                monitor.interval
            ) {

                clearInterval(

                    monitor.interval

                );

                monitor.interval = null;

            }


            // ==================================================
            // AMBIL CHANNEL
            // ==================================================

            const channel =

                await message.client.channels.fetch(

                    monitor.channelId

                );


            // ==================================================
            // AMBIL PESAN LIVE
            // ==================================================

            const liveMessage =

                await channel.messages.fetch(

                    monitor.messageId

                );


            // ==================================================
            // EDIT EMBED LIVE LAMA
            // ==================================================

            await liveMessage.edit({

                embeds: [

                    createStopEmbed(

                        server,

                        monitor.searchName

                    )

                ]

            });


            // ==================================================
            // HAPUS DARI MAP
            // ==================================================

            liveMonitors.delete(

                monitorKey

            );


            // ==================================================
            // HAPUS DARI JSON
            // ==================================================

            saveLiveMonitors();


            console.log(

                `[Live] Monitoring dihentikan: ` +

                `${server.name} - ${playerName}`

            );


            // ==================================================
            // TIDAK MENGIRIM PESAN BARU
            // ==================================================

            return;


        } catch (error) {

            console.error(

                '[Live] Error pada command .stop:',

                error

            );


            // ==================================================
            // HENTIKAN INTERVAL
            // ==================================================

            if (
                monitor.interval
            ) {

                clearInterval(

                    monitor.interval

                );

                monitor.interval = null;

            }


            // ==================================================
            // HAPUS DARI MAP
            // ==================================================

            liveMonitors.delete(

                monitorKey

            );


            // ==================================================
            // HAPUS DARI JSON
            // ==================================================

            saveLiveMonitors();


            return message.reply(

                '❌ Pesan Live Monitoring tidak dapat diedit. ' +

                'Monitoring telah dihentikan.'

            );

        }

    }

};
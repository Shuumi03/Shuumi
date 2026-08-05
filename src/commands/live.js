const fs = require('fs');
const path = require('path');

const {
    getPlayers
} = require('../services/fivem/cfxApi');

const {
    parsePlayers,
    findPlayersByName
} = require('../services/fivem/playerParser');

const {
    getServer
} = require('../config/serverConfig');

const {
    EmbedBuilder
} = require('discord.js');


// ======================================================
// LOKASI FILE LIVE MONITORING
// ======================================================

const DATA_FILE = path.join(
    __dirname,
    '../data/liveMonitors.json'
);


// ======================================================
// MAP LIVE MONITORING
// ======================================================

const liveMonitors = new Map();


// ======================================================
// PASTIKAN FOLDER DAN FILE TERSEDIA
// ======================================================

function ensureDataFile() {

    try {

        const dataDirectory =
            path.dirname(DATA_FILE);


        if (
            !fs.existsSync(
                dataDirectory
            )
        ) {

            fs.mkdirSync(
                dataDirectory,
                {
                    recursive: true
                }
            );

        }


        if (
            !fs.existsSync(
                DATA_FILE
            )
        ) {

            fs.writeFileSync(

                DATA_FILE,

                JSON.stringify(
                    [],
                    null,
                    4
                )

            );

        }

    } catch (error) {

        console.error(
            '[Live] Gagal menyiapkan file data:',
            error
        );

    }

}


// ======================================================
// BACA DATA LIVE MONITORING DARI JSON
// ======================================================

function loadLiveMonitors() {

    try {

        ensureDataFile();


        const data =
            fs.readFileSync(
                DATA_FILE,
                'utf8'
            );


        const monitors =
            JSON.parse(
                data
            );


        if (
            !Array.isArray(
                monitors
            )
        ) {

            return [];

        }


        return monitors;

    } catch (error) {

        console.error(
            '[Live] Gagal membaca liveMonitors.json:',
            error
        );


        return [];

    }

}


// ======================================================
// SIMPAN DATA LIVE MONITORING KE JSON
// ======================================================

function saveLiveMonitors() {

    try {

        ensureDataFile();


        const monitors =

            Array.from(
                liveMonitors.values()
            )

            .map(
                monitor => ({

                    messageId:
                        monitor.messageId,

                    channelId:
                        monitor.channelId,

                    guildId:
                        monitor.guildId,

                    serverAlias:
                        monitor.serverAlias,

                    serverName:
                        monitor.serverName,

                    searchName:
                        monitor.searchName

                })
            );


        fs.writeFileSync(

            DATA_FILE,

            JSON.stringify(
                monitors,
                null,
                4
            )

        );


        return true;

    } catch (error) {

        console.error(
            '[Live] Gagal menyimpan liveMonitors.json:',
            error
        );


        return false;

    }

}


// ======================================================
// BUAT MONITOR KEY
// ======================================================
// PENTING:
// Fungsi ini digunakan oleh .live, .stop,
// dan sistem recovery setelah restart.
// Jadi semuanya menggunakan format key yang sama.
// ======================================================

function createMonitorKey(
    guildId,
    serverAlias,
    searchName
) {

    return (

        `${guildId}:` +

        `${serverAlias.toLowerCase()}:` +

        `${searchName.toLowerCase().trim()}`

    );

}


// ======================================================
// IKON KUALITAS PING
// ======================================================

function getPingIcon(
    ping
) {

    const numericPing =
        Number(
            ping
        );


    if (
        numericPing <= 50
    ) {

        return '🟢';

    }


    if (
        numericPing <= 100
    ) {

        return '🟡';

    }


    return '🔴';

}


// ======================================================
// BUAT EMBED LIVE
// ======================================================

function createLiveEmbed(
    server,
    searchName,
    foundPlayers
) {

    const upperSearchName =

        searchName.toUpperCase();


    let playerList;


    // ==================================================
    // JIKA PLAYER TIDAK DITEMUKAN
    // ==================================================

    if (
        foundPlayers.length === 0
    ) {

        playerList =

            '❌ Player tidak ditemukan.';

    }


    // ==================================================
    // JIKA PLAYER DITEMUKAN
    // ==================================================

    else {

        playerList =

            foundPlayers

                .map(
                    player => {

                        const pingIcon =

                            getPingIcon(
                                player.ping
                            );


                        return (

                            `${pingIcon} ` +

                            `\`${player.id}\` ` +

                            `**${player.name}** ` +

                            `\`${player.ping} ms\``

                        );

                    }
                )

                .join('\n');

    }


    // ==================================================
    // DESCRIPTION
    // ==================================================

    const description =

        `🔴 **Live Player ${server.name} ${upperSearchName}**\n\n` +

        `👥 **${foundPlayers.length} Player Ditemukan**\n\n` +

        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +

        `${playerList}\n\n` +

        `━━━━━━━━━━━━━━━━━━━━━━`;


    // ==================================================
    // EMBED
    // ==================================================

    return (

        new EmbedBuilder()

            .setAuthor({

                name:
                    'Petuah Bukan Nabi'

            })

            .setDescription(

                description

            )

            .setFooter({

                text:
                    'Dev By Kacung'

            })

            .setTimestamp()

    );

}


// ======================================================
// BUAT EMBED STOP
// ======================================================

function createStopEmbed(
    server,
    searchName
) {

    const description =

        `🛑 **Stop Live ${server.name} ${searchName.toUpperCase()}**\n\n` +

        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +

        `✅ Live monitoring berhasil dihentikan.\n\n` +

        `━━━━━━━━━━━━━━━━━━━━━━`;


    return (

        new EmbedBuilder()

            .setAuthor({

                name:
                    'Petuah Bukan Nabi'

            })

            .setDescription(

                description

            )

            .setFooter({

                text:
                    'Dev By Kacung'

            })

            .setTimestamp()

    );

}


// ======================================================
// UPDATE LIVE MONITORING
// ======================================================

async function updateLiveMonitor(
    monitor
) {

    try {

        // ==================================================
        // CARI SERVER
        // ==================================================

        const server =

            getServer(

                monitor.serverAlias

            );


        if (
            !server
        ) {

            console.error(

                `[Live] Server ${monitor.serverAlias} tidak ditemukan.`

            );

            return;

        }


        // ==================================================
        // AMBIL DATA PLAYER
        // ==================================================

        const {
            players: playersData
        } = await getPlayers(

            server.cfxId

        );


        // ==================================================
        // PARSE PLAYER
        // ==================================================

        const players =

            parsePlayers(

                playersData

            );


        // ==================================================
        // CARI PLAYER
        // ==================================================

        const foundPlayers =

            findPlayersByName(

                players,

                monitor.searchName

            );


        // ==================================================
        // AMBIL CHANNEL
        // ==================================================

        const channel =

            await monitor.client.channels.fetch(

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
        // EDIT EMBED YANG SAMA
        // ==================================================

        await liveMessage.edit({

            embeds: [

                createLiveEmbed(

                    server,

                    monitor.searchName,

                    foundPlayers

                )

            ]

        });


    } catch (error) {

        console.error(

            `[Live] Gagal update monitoring ${monitor.messageId}:`,

            error

        );

    }

}


// ======================================================
// MULAI INTERVAL LIVE
// ======================================================

function startMonitorInterval(
    monitor
) {

    // ==================================================
    // HENTIKAN INTERVAL LAMA JIKA ADA
    // ==================================================

    if (
        monitor.interval
    ) {

        clearInterval(

            monitor.interval

        );

    }


    // ==================================================
    // JALANKAN SETIAP 15 DETIK
    // ==================================================

    monitor.interval =

        setInterval(

            async () => {

                await updateLiveMonitor(

                    monitor

                );

            },

            15000

        );

}


// ======================================================
// COMMAND .LIVE
// ======================================================

module.exports = {

    name: 'live',


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

                '`.live <Server> <Nama_Player>`\n\n' +

                'Contoh:\n' +

                '`.live satumimpi umc`\n' +

                '`.live sm umc`'

            );

        }


        // ==================================================
        // SERVER
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
        // CEK MONITORING SUDAH BERJALAN
        // ==================================================

        if (
            liveMonitors.has(
                monitorKey
            )
        ) {

            return message.reply(

                `⚠️ Live monitoring untuk ` +

                `**${playerName}** ` +

                `di server **${server.name}** ` +

                `sudah berjalan.`

            );

        }


        try {

            // ==================================================
            // AMBIL DATA PLAYER
            // ==================================================

            const {
                players: playersData
            } = await getPlayers(

                server.cfxId

            );


            // ==================================================
            // PARSE DATA
            // ==================================================

            const players =

                parsePlayers(

                    playersData

                );


            // ==================================================
            // CARI PLAYER
            // ==================================================

            const foundPlayers =

                findPlayersByName(

                    players,

                    playerName

                );


            // ==================================================
            // KIRIM EMBED LIVE
            // ==================================================

            const liveMessage =

                await message.reply({

                    embeds: [

                        createLiveEmbed(

                            server,

                            playerName,

                            foundPlayers

                        )

                    ]

                });


            // ==================================================
            // BUAT OBJECT MONITOR
            // ==================================================

            const monitor = {

                messageId:
                    liveMessage.id,

                channelId:
                    message.channel.id,

                guildId:
                    message.guild.id,

                serverAlias:
                    server.alias,

                serverName:
                    server.name,

                searchName:
                    playerName,

                interval:
                    null,

                client:
                    message.client

            };


            // ==================================================
            // SIMPAN KE MAP
            // ==================================================

            liveMonitors.set(

                monitorKey,

                monitor

            );


            // ==================================================
            // SIMPAN KE JSON
            // ==================================================

            saveLiveMonitors();


            // ==================================================
            // MULAI MONITORING
            // ==================================================

            startMonitorInterval(

                monitor

            );


            console.log(

                `[Live] Monitoring dimulai: ` +

                `${server.name} - ${playerName}`

            );


        } catch (error) {

            console.error(

                '[Live] Error pada command .live:',

                error

            );


            return message.reply(

                '❌ Terjadi kesalahan saat mengambil data server FiveM.'

            );

        }

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports.liveMonitors =

    liveMonitors;


module.exports.createMonitorKey =

    createMonitorKey;


module.exports.createStopEmbed =

    createStopEmbed;


module.exports.startMonitorInterval =

    startMonitorInterval;


module.exports.loadLiveMonitors =

    loadLiveMonitors;


module.exports.saveLiveMonitors =

    saveLiveMonitors;


module.exports.updateLiveMonitor =

    updateLiveMonitor;
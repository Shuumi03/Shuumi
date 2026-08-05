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
// FUNGSI UNTUK MENENTUKAN IKON KUALITAS PING
// ======================================================

function getPingIcon(ping) {

    if (ping <= 50) {
        // Ping bagus
        return '🟢';
    }

    if (ping <= 100) {
        // Ping agak kurang bagus
        return '🟡';
    }

    // Ping jelek
    return '🔴';
}


module.exports = {

    name: 'player',

    async execute(message, args) {

        // ======================================================
        // CEK FORMAT COMMAND
        // ======================================================

        if (args.length < 2) {

            return message.reply(
                'Format command salah.\n\n' +
                'Gunakan:\n' +
                '`.player <Server> <Nama_Player>`\n\n' +
                'Contoh:\n' +
                '`.player satumimpi umc`\n' +
                '`.player sm umc`'
            );
        }


        // ======================================================
        // AMBIL INPUT SERVER
        // ======================================================

        const serverInput =
            args[0];


        // ======================================================
        // AMBIL NAMA PLAYER
        // ======================================================

        const playerName =
            args
                .slice(1)
                .join(' ')
                .trim();


        // ======================================================
        // CARI SERVER
        // ======================================================

        const server =
            getServer(
                serverInput
            );


        // ======================================================
        // JIKA SERVER TIDAK DITEMUKAN
        // ======================================================

        if (!server) {

            return message.reply(
                `❌ Server **${serverInput}** tidak ditemukan.\n\n` +
                `Server yang tersedia saat ini:\n` +
                `• \`satumimpi\`\n` +
                `• \`sm\``
            );
        }


        try {

            // ======================================================
            // PESAN LOADING
            // ======================================================

            const loadingMessage =
                await message.reply(
                    '🔍 Sedang mencari player...'
                );


            // ======================================================
            // AMBIL DATA PLAYER DARI FIVEM
            // ======================================================

            const {
                players: playersData
            } = await getPlayers(
                server.cfxId
            );


            // ======================================================
            // PARSE DATA PLAYER
            // ======================================================

            const players =
                parsePlayers(
                    playersData
                );


            // ======================================================
            // CARI PLAYER BERDASARKAN NAMA
            // ======================================================

            const foundPlayers =
                findPlayersByName(
                    players,
                    playerName
                );


            // ======================================================
            // NAMA PENCARIAN MENJADI HURUF KAPITAL
            // ======================================================

            const searchName =
                playerName.toUpperCase();


            // ======================================================
            // TENTUKAN ISI DAFTAR PLAYER
            // ======================================================

            let playerList;


            if (
                foundPlayers.length === 0
            ) {

                // ==================================================
                // JIKA PLAYER TIDAK DITEMUKAN
                // ==================================================

                playerList =
                    '❌ Player tidak ditemukan.';

            } else {

                // ==================================================
                // JIKA PLAYER DITEMUKAN
                // ==================================================

                playerList =

                    foundPlayers

                        .map(
                            (player) => {

                                // ----------------------------------
                                // AMBIL IKON BERDASARKAN PING
                                // ----------------------------------

                                const pingIcon =
                                    getPingIcon(
                                        player.ping
                                    );


                                // ----------------------------------
                                // FORMAT PLAYER
                                // ----------------------------------

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


            // ======================================================
            // BUAT ISI EMBED
            // ======================================================

            const description =

                `🔍 **Player ${server.name} ${searchName}**\n\n` +

                `👥 **${foundPlayers.length} Player Ditemukan**\n\n` +

                `━━━━━━━━━━━━━━━━━━━━━━\n\n` +

                `${playerList}\n\n` +

                `━━━━━━━━━━━━━━━━━━━━━━`;


            // ======================================================
            // BUAT EMBED
            // ======================================================

            const embed =

                new EmbedBuilder()

                    // ------------------------------------------
                    // HEADER
                    // ------------------------------------------

                    .setAuthor({

                        name:
                            'Petuah Bukan Nabi'
                    })


                    // ------------------------------------------
                    // ISI EMBED
                    // ------------------------------------------

                    .setDescription(
                        description
                    )


                    // ------------------------------------------
                    // FOOTER
                    // ------------------------------------------

                    .setFooter({

                        text:
                            'Dev By Kacung'
                    })


                    // ------------------------------------------
                    // TIMESTAMP DISCORD
                    // ------------------------------------------

                    .setTimestamp();


            // ======================================================
            // UBAH PESAN LOADING MENJADI HASIL
            // ======================================================

            await loadingMessage.edit({

                content: '',

                embeds: [
                    embed
                ]
            });


        } catch (error) {


            // ======================================================
            // ERROR HANDLER
            // ======================================================

            console.error(

                'Error pada command .player:',

                error
            );


            await message.reply(

                `❌ Gagal mencari player di server **${server.name}**.\n\n` +

                `Error: ${error.message}`
            );
        }
    }
};
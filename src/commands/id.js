const {
    getPlayers
} = require('../services/fivem/cfxApi');

const {
    parsePlayers
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

    name: 'id',

    async execute(message, args) {

        // ======================================================
        // CEK FORMAT COMMAND
        // ======================================================

        if (args.length < 2) {

            return message.reply(
                'Format command salah.\n\n' +
                'Gunakan:\n' +
                '`.id <Server> <ID_Player>`\n\n' +
                'Contoh:\n' +
                '`.id satumimpi 123`\n' +
                '`.id sm 123`'
            );
        }


        // ======================================================
        // AMBIL INPUT SERVER
        // ======================================================

        const serverInput =
            args[0];


        // ======================================================
        // AMBIL ID PLAYER
        // ======================================================

        const playerIdInput =
            args[1];


        // ======================================================
        // VALIDASI ID PLAYER
        // ======================================================

        if (
            !/^\d+$/.test(
                playerIdInput
            )
        ) {

            return message.reply(
                '❌ ID player harus berupa angka.\n\n' +
                'Contoh:\n' +
                '`.id sm 123`'
            );
        }


        // ======================================================
        // UBAH ID MENJADI NUMBER
        // ======================================================

        const playerId =
            Number(
                playerIdInput
            );


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
            // CARI PLAYER BERDASARKAN ID
            // ======================================================

            const foundPlayer =
                players.find(

                    (player) =>
                        Number(
                            player.id
                        ) === playerId
                );


            // ======================================================
            // BUAT ISI HASIL PLAYER
            // ======================================================

            let playerResult;


            if (!foundPlayer) {

                // ==================================================
                // JIKA PLAYER TIDAK DITEMUKAN
                // ==================================================

                playerResult =
                    '❌ Player tidak ditemukan.';

            } else {

                // ==================================================
                // JIKA PLAYER DITEMUKAN
                // ==================================================

                const pingIcon =
                    getPingIcon(
                        foundPlayer.ping
                    );


                playerResult =

                    `${pingIcon} ` +

                    `\`${foundPlayer.id}\` ` +

                    `**${foundPlayer.name}** ` +

                    `\`${foundPlayer.ping} ms\``;
            }


            // ======================================================
            // BUAT ISI EMBED
            // ======================================================

            const description =

                `🔍 **Player ID ${playerId} ${server.name}**\n\n` +

                `━━━━━━━━━━━━━━━━━━━━━━\n\n` +

                `${playerResult}\n\n` +

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

                'Error pada command .id:',

                error
            );


            await message.reply(

                `❌ Gagal mencari player dengan ID **${playerId}** di server **${server.name}**.\n\n` +

                `Error: ${error.message}`
            );
        }
    }
};
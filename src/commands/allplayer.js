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
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');


// ======================================================
// JUMLAH PLAYER PER HALAMAN
// ======================================================

const PLAYERS_PER_PAGE = 20;


// ======================================================
// FUNGSI MENENTUKAN IKON PING
// ======================================================

function getPingIcon(ping) {

    if (ping <= 50) {
        return '🟢';
    }

    if (ping <= 100) {
        return '🟡';
    }

    return '🔴';
}


// ======================================================
// FUNGSI MEMBUAT DAFTAR PLAYER
// ======================================================

function createPlayerList(
    players,
    currentPage
) {

    const startIndex =
        currentPage *
        PLAYERS_PER_PAGE;


    const pagePlayers =
        players.slice(

            startIndex,

            startIndex +
            PLAYERS_PER_PAGE
        );


    return pagePlayers

        .map(

            (player) => {

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


// ======================================================
// FUNGSI MEMBUAT EMBED PLAYER
// ======================================================

function createEmbed(
    server,
    players,
    currentPage
) {

    const totalPages =
        Math.ceil(

            players.length /
            PLAYERS_PER_PAGE
        );


    const playerList =
        createPlayerList(

            players,

            currentPage
        );


    const pageNumber =
        currentPage + 1;


    const description =

        `🔍 **Semua Player ${server.name}**\n\n` +

        `👥 **${players.length} Player Ditemukan**\n\n` +

        `📄 **Halaman ${pageNumber}/${totalPages}**\n\n` +

        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +

        `${playerList}\n\n` +

        `━━━━━━━━━━━━━━━━━━━━━━`;


    return new EmbedBuilder()

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

        .setTimestamp();
}


// ======================================================
// FUNGSI MEMBUAT TOMBOL PAGINATION
// ======================================================

function createButtons(
    currentPage,
    totalPages
) {

    const previousButton =

        new ButtonBuilder()

            .setCustomId(

                'allplayer_previous'
            )

            .setLabel(

                'Previous'
            )

            .setEmoji(

                '◀️'
            )

            .setStyle(

                ButtonStyle.Secondary
            )

            .setDisabled(

                currentPage === 0
            );


    const nextButton =

        new ButtonBuilder()

            .setCustomId(

                'allplayer_next'
            )

            .setLabel(

                'Next'
            )

            .setEmoji(

                '▶️'
            )

            .setStyle(

                ButtonStyle.Secondary
            )

            .setDisabled(

                currentPage >=
                totalPages - 1
            );


    return new ActionRowBuilder()

        .addComponents(

            previousButton,

            nextButton
        );
}


// ======================================================
// EXPORT COMMAND
// ======================================================

module.exports = {

    name: 'allplayer',


    async execute(
        message,
        args
    ) {

        // ==================================================
        // CEK FORMAT COMMAND
        // ==================================================

        if (
            args.length < 1
        ) {

            return message.reply(

                'Format command salah.\n\n' +

                'Gunakan:\n' +

                '`.allplayer <Server>`\n\n' +

                'Contoh:\n' +

                '`.allplayer sm`\n' +

                '`.allplayer satumimpi`'
            );
        }


        // ==================================================
        // AMBIL INPUT SERVER
        // ==================================================

        const serverInput =
            args[0];


        // ==================================================
        // CARI SERVER
        // ==================================================

        const server =
            getServer(

                serverInput
            );


        // ==================================================
        // JIKA SERVER TIDAK DITEMUKAN
        // ==================================================

        if (!server) {

            return message.reply(

                `❌ Server **${serverInput}** tidak ditemukan.\n\n` +

                `Server yang tersedia saat ini:\n` +

                `• \`satumimpi\`\n` +

                `• \`sm\``
            );
        }


        try {

            // ==================================================
            // PESAN LOADING
            // ==================================================

            const loadingMessage =

                await message.reply(

                    '🔍 Sedang mengambil semua player...'
                );


            // ==================================================
            // AMBIL DATA PLAYER DARI FIVEM
            // ==================================================

            const {

                players:
                    playersData

            } = await getPlayers(

                server.cfxId
            );


            // ==================================================
            // PARSE DATA PLAYER
            // ==================================================

            const players =

                parsePlayers(

                    playersData
                );


            // ==================================================
            // JIKA TIDAK ADA PLAYER
            // ==================================================

            if (
                players.length === 0
            ) {

                const embed =

                    new EmbedBuilder()

                        .setAuthor({

                            name:
                                'Petuah Bukan Nabi'
                        })

                        .setDescription(

                            `🔍 **Semua Player ${server.name}**\n\n` +

                            `👥 **0 Player Ditemukan**\n\n` +

                            `━━━━━━━━━━━━━━━━━━━━━━\n\n` +

                            `❌ Tidak ada player yang sedang online.\n\n` +

                            `━━━━━━━━━━━━━━━━━━━━━━`
                        )

                        .setFooter({

                            text:
                                'Dev By Kacung'
                        })

                        .setTimestamp();


                return loadingMessage.edit({

                    content:
                        '',

                    embeds: [

                        embed
                    ],

                    components: []
                });
            }


            // ==================================================
            // HALAMAN PERTAMA
            // ==================================================

            let currentPage = 0;


            // ==================================================
            // HITUNG TOTAL HALAMAN
            // ==================================================

            const totalPages =

                Math.ceil(

                    players.length /
                    PLAYERS_PER_PAGE
                );


            // ==================================================
            // BUAT EMBED AWAL
            // ==================================================

            const embed =

                createEmbed(

                    server,

                    players,

                    currentPage
                );


            // ==================================================
            // BUAT TOMBOL AWAL
            // ==================================================

            const buttons =

                createButtons(

                    currentPage,

                    totalPages
                );


            // ==================================================
            // EDIT PESAN LOADING
            // MENJADI HASIL PLAYER
            // ==================================================

            await loadingMessage.edit({

                content:
                    '',

                embeds: [

                    embed
                ],

                components: [

                    buttons
                ]
            });


            // ==================================================
            // COLLECTOR TOMBOL PAGINATION
            // ==================================================

            const collector =

                loadingMessage.createMessageComponentCollector({

                    filter:
                        (interaction) =>

                            interaction.customId ===
                                'allplayer_previous' ||

                            interaction.customId ===
                                'allplayer_next',

                    time:
                        10 * 60 * 1000
                });


            // ==================================================
            // SAAT TOMBOL DITEKAN
            // ==================================================

            collector.on(

                'collect',

                async (interaction) => {

                    // ==========================================
                    // PREVIOUS
                    // ==========================================

                    if (

                        interaction.customId ===
                        'allplayer_previous'

                    ) {

                        if (
                            currentPage > 0
                        ) {

                            currentPage--;
                        }
                    }


                    // ==========================================
                    // NEXT
                    // ==========================================

                    if (

                        interaction.customId ===
                        'allplayer_next'

                    ) {

                        if (

                            currentPage <
                            totalPages - 1

                        ) {

                            currentPage++;
                        }
                    }


                    // ==========================================
                    // BUAT EMBED HALAMAN BARU
                    // ==========================================

                    const updatedEmbed =

                        createEmbed(

                            server,

                            players,

                            currentPage
                        );


                    // ==========================================
                    // UPDATE TOMBOL
                    // ==========================================

                    const updatedButtons =

                        createButtons(

                            currentPage,

                            totalPages
                        );


                    // ==========================================
                    // EDIT PESAN YANG SAMA
                    // ==========================================

                    await interaction.update({

                        embeds: [

                            updatedEmbed
                        ],

                        components: [

                            updatedButtons
                        ]
                    });

                }
            );


            // ==================================================
            // SAAT COLLECTOR SELESAI
            // ==================================================

            collector.on(

                'end',

                async () => {

                    try {

                        const disabledButtons =

                            new ActionRowBuilder()

                                .addComponents(

                                    new ButtonBuilder()

                                        .setCustomId(

                                            'allplayer_previous_disabled'
                                        )

                                        .setLabel(

                                            'Previous'
                                        )

                                        .setEmoji(

                                            '◀️'
                                        )

                                        .setStyle(

                                            ButtonStyle.Secondary
                                        )

                                        .setDisabled(

                                            true
                                        ),

                                    new ButtonBuilder()

                                        .setCustomId(

                                            'allplayer_next_disabled'
                                        )

                                        .setLabel(

                                            'Next'
                                        )

                                        .setEmoji(

                                            '▶️'
                                        )

                                        .setStyle(

                                            ButtonStyle.Secondary
                                        )

                                        .setDisabled(

                                            true
                                        )
                                );


                        await loadingMessage.edit({

                            components: [

                                disabledButtons
                            ]
                        });

                    } catch (error) {

                        console.log(

                            'Pagination selesai.'
                        );

                    }

                }
            );


        } catch (error) {


            // ==================================================
            // ERROR HANDLER
            // ==================================================

            console.error(

                'Error pada command .allplayer:',

                error
            );


            await message.reply(

                `❌ Gagal mengambil daftar player dari server **${server.name}**.\n\n` +

                `Error: ${error.message}`
            );
        }
    }
};
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const {
    isOwner
} = require('../config/permissions');

const {
    getLogs
} = require('../services/fivem/logService');


// ======================================================
// KONFIGURASI PAGINATION
// ======================================================

const LOGS_PER_PAGE = 20;


// ======================================================
// BUAT EMBED LOG
// ======================================================

function createLogsEmbed(
    logs,
    page,
    totalPages
) {

    // ==================================================
    // HITUNG RANGE LOG
    // ==================================================

    const startIndex =
        page *
        LOGS_PER_PAGE;


    const pageLogs =
        logs.slice(

            startIndex,

            startIndex +
            LOGS_PER_PAGE

        );


    // ==================================================
    // FORMAT LOG
    // ==================================================

    const logList =

        pageLogs

            .map(

                (
                    log,
                    index
                ) => {

                    const date =

                        new Date(
                            log.timestamp
                        );


                    const formattedDate =

                        isNaN(
                            date.getTime()
                        )

                            ? 'Waktu tidak diketahui'

                            : `<t:${Math.floor(date.getTime() / 1000)}:f>`;


                    const argsText =

                        Array.isArray(
                            log.args
                        ) &&

                        log.args.length > 0

                            ? ` ${log.args.join(' ')}`

                            : '';


                    return (

                        `**${startIndex + index + 1}.** ` +

                        `\`.${log.command}${argsText}\`\n` +

                        `👤 ${log.username}\n` +

                        `🆔 ${log.userId}\n` +

                        `🌐 ${log.guildName}\n` +

                        `💬 #${log.channelName}\n` +

                        `🕒 ${formattedDate}`

                    );

                }

            )

            .join(

                '\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n'

            );


    // ==================================================
    // BUAT EMBED
    // ==================================================

    return new EmbedBuilder()

        .setAuthor({

            name:
                'Petuah Bukan Nabi'

        })

        .setDescription(

            `📋 **Log Aktivitas Bot**\n\n` +

            `Menampilkan ${logs.length} aktivitas terakhir.\n\n` +

            `━━━━━━━━━━━━━━━━━━━━━━\n\n` +

            `${logList}`

        )

        .setFooter({

            text:
                `Dev By Kacung • Halaman ${page + 1}/${totalPages}`

        })

        .setTimestamp();

}


// ======================================================
// BUAT TOMBOL PAGINATION
// ======================================================

function createPaginationButtons(
    page,
    totalPages
) {

    const previousButton =

        new ButtonBuilder()

            .setCustomId(
                'logs_previous'
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

                page === 0

            );


    const nextButton =

        new ButtonBuilder()

            .setCustomId(
                'logs_next'
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

                page >=
                totalPages - 1

            );


    return new ActionRowBuilder()

        .addComponents(

            previousButton,

            nextButton

        );

}


// ======================================================
// COMMAND .LOGS
// ======================================================

module.exports = {

    name: 'logs',


    async execute(
        message,
        args
    ) {

        // ==================================================
        // CEK OWNER
        // ==================================================

        if (
            !isOwner(
                message.author.id
            )
        ) {

            return message.reply(

                '❌ Hanya **Owner Bot** yang dapat melihat log aktivitas bot.'

            );

        }


        // ==================================================
        // AMBIL DATA LOG
        // ==================================================

        const logs =

            getLogs(
                1000
            );


        // ==================================================
        // JIKA BELUM ADA LOG
        // ==================================================

        if (
            logs.length === 0
        ) {

            const embed =

                new EmbedBuilder()

                    .setAuthor({

                        name:
                            'Petuah Bukan Nabi'

                    })

                    .setDescription(

                        `📋 **Log Aktivitas Bot**\n\n` +

                        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +

                        `📭 Belum ada aktivitas yang tercatat.\n\n` +

                        `━━━━━━━━━━━━━━━━━━━━━━`

                    )

                    .setFooter({

                        text:
                            'Dev By Kacung'

                    })

                    .setTimestamp();


            return message.reply({

                embeds: [

                    embed

                ]

            });

        }


        // ==================================================
        // HITUNG JUMLAH HALAMAN
        // ==================================================

        const totalPages =

            Math.ceil(

                logs.length /
                LOGS_PER_PAGE

            );


        // ==================================================
        // HALAMAN AWAL
        // ==================================================

        let currentPage = 0;


        // ==================================================
        // BUAT EMBED AWAL
        // ==================================================

        const embed =

            createLogsEmbed(

                logs,

                currentPage,

                totalPages

            );


        // ==================================================
        // BUAT TOMBOL AWAL
        // ==================================================

        const buttons =

            createPaginationButtons(

                currentPage,

                totalPages

            );


        // ==================================================
        // KIRIM PESAN
        // ==================================================

        const replyMessage =

            await message.reply({

                embeds: [

                    embed

                ],

                components:

                    totalPages > 1

                        ? [

                            buttons

                        ]

                        : []

            });


        // ==================================================
        // JIKA HANYA 1 HALAMAN
        // TIDAK PERLU COLLECTOR
        // ==================================================

        if (
            totalPages <= 1
        ) {

            return;

        }


        // ==================================================
        // BUAT COLLECTOR
        // ==================================================

        const collector =

            replyMessage.createMessageComponentCollector({

                time:
                    10 * 60 * 1000

            });


        // ==================================================
        // EVENT TOMBOL DIKLIK
        // ==================================================

        collector.on(

            'collect',

            async (
                interaction
            ) => {

                // ==================================================
                // CEK USER
                // ==================================================

                if (
                    interaction.user.id !==
                    message.author.id
                ) {

                    return interaction.reply({

                        content:
                            '❌ Hanya Owner Bot yang menjalankan command ini yang dapat menggunakan tombol pagination.',

                        ephemeral:
                            true

                    });

                }


                // ==================================================
                // NEXT
                // ==================================================

                if (
                    interaction.customId ===
                    'logs_next'
                ) {

                    if (
                        currentPage <
                        totalPages - 1
                    ) {

                        currentPage++;

                    }

                }


                // ==================================================
                // PREVIOUS
                // ==================================================

                if (
                    interaction.customId ===
                    'logs_previous'
                ) {

                    if (
                        currentPage >
                        0
                    ) {

                        currentPage--;

                    }

                }


                // ==================================================
                // BUAT EMBED BARU
                // ==================================================

                const updatedEmbed =

                    createLogsEmbed(

                        logs,

                        currentPage,

                        totalPages

                    );


                // ==================================================
                // BUAT TOMBOL BARU
                // ==================================================

                const updatedButtons =

                    createPaginationButtons(

                        currentPage,

                        totalPages

                    );


                // ==================================================
                // EDIT PESAN YANG SAMA
                // ==================================================

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
        // COLLECTOR SELESAI
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
                                        'logs_previous_disabled'
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
                                        'logs_next_disabled'
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


                    await replyMessage.edit({

                        components: [

                            disabledButtons

                        ]

                    });

                } catch (
                    error
                ) {

                    console.error(

                        'Gagal menonaktifkan tombol pagination logs:',

                        error

                    );

                }

            }

        );

    }

};
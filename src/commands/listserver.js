const {
    EmbedBuilder
} = require('discord.js');

const {
    getAllServers
} = require('../config/serverConfig');


module.exports = {

    name: 'listserver',


    async execute(
        message,
        args
    ) {

        // ==================================================
        // AMBIL SEMUA SERVER
        // ==================================================

        const servers =
            getAllServers();


        // ==================================================
        // BUAT EMBED
        // ==================================================

        const embed =
            new EmbedBuilder()

                .setAuthor({
                    name: 'Petuah Bukan Nabi'
                })

                .setTitle(
                    '🌐 Daftar Server'
                )

                .setColor(
                    0x2b2d31
                )

                .setFooter({
                    text: 'Dev By Kacung'
                })

                .setTimestamp();


        // ==================================================
        // JIKA BELUM ADA SERVER
        // ==================================================

        if (
            servers.length === 0
        ) {

            embed.setDescription(

                '━━━━━━━━━━━━━━━━━━━━━━\n\n' +

                '❌ **Tidak ada server yang terdaftar.**\n\n' +

                '━━━━━━━━━━━━━━━━━━━━━━'

            );


            return message.reply({

                embeds: [
                    embed
                ]

            });

        }


        // ==================================================
        // BUAT DAFTAR SERVER
        // ==================================================

        const serverList =

            servers
                .map(
                    (server, index) => {

                        return (

                            `**${index + 1}. 🟢 ${server.name}**\n` +

                            `🔹 Alias : ${server.alias}\n` +

                            `🔗 CFX ID : ${server.cfxId}`

                        );

                    }
                )
                .join('\n\n');


        // ==================================================
        // ISI EMBED
        // ==================================================

        embed.setDescription(

            `${serverList}\n\n` +

            '━━━━━━━━━━━━━━━━━━━━━━\n\n' +

            `🌐 **${servers.length} Server Terdaftar**`

        );


        // ==================================================
        // KIRIM EMBED
        // ==================================================

        return message.reply({

            embeds: [
                embed
            ]

        });

    }

};
const {
    EmbedBuilder
} = require('discord.js');


// ======================================================
// COMMAND .HELP
// ======================================================

module.exports = {

    name: 'help',


    async execute(
        message,
        args
    ) {

        // ==================================================
        // LOAD SISTEM PERMISSION
        // ==================================================

        const permissions =
            require('../config/permissions');


        // ==================================================
        // TENTUKAN LEVEL PERMISSION USER
        // ==================================================

        let permissionLevel =
            'user';


        // ==================================================
        // CEK OWNER
        // ==================================================

        if (
            typeof permissions.isOwner === 'function' &&
            permissions.isOwner(
                message.author.id
            )
        ) {

            permissionLevel =
                'owner';

        }


        // ==================================================
        // CEK ADMIN BOT
        // ==================================================

        else if (

            typeof permissions.isAdmin === 'function' &&

            permissions.isAdmin(
                message.author.id
            )

        ) {

            permissionLevel =
                'admin';

        }


        // ======================================================
        // COMMAND USER
        // ======================================================

        const userCommands = [

            '🔍 `.player <server> <nama>`\n' +
            '   Mencari player berdasarkan nama di server FiveM.',

            '🆔 `.id <server> <id>`\n' +
            '   Mencari informasi player berdasarkan nomor ID player.',

            '👥 `.allplayer <server>`\n' +
            '   Menampilkan seluruh player yang sedang online di server.',

            '🔴 `.live <server> <nama>`\n' +
            '   Memantau player secara live dan memperbarui informasi secara otomatis.',

            '🛑 `.stop <server> <nama>`\n' +
            '   Menghentikan live monitoring player yang sedang berjalan.',

            '🌐 `.listserver`\n' +
            '   Menampilkan daftar server FiveM yang tersedia untuk dicari.',

            '❓ `.help`\n' +
            '   Menampilkan daftar command dan fungsi yang tersedia untuk akunmu.'

        ];


        // ======================================================
        // COMMAND ADMIN BOT
        // ======================================================

        const adminCommands = [

            '➕ `.addserver <nama> <cfx> <alias>`\n' +
            '   Menambahkan server FiveM baru ke dalam daftar bot.',

            '➖ `.removeserver <server>`\n' +
            '   Menghapus server FiveM yang sudah terdaftar di bot.',

            '📋 `.listadmin`\n' +
            '   Menampilkan daftar pengguna yang memiliki akses sebagai Admin Bot.'

        ];


        // ======================================================
        // COMMAND OWNER
        // ======================================================

        const ownerCommands = [

            '🛡️ `.addadmin <@user>`\n' +
            '   Menambahkan pengguna Discord sebagai Admin Bot.',

            '🗑️ `.removeadmin <@user>`\n' +
            '   Menghapus pengguna dari daftar Admin Bot.',

            '👑 `.owner`\n' +
            '   Menampilkan informasi bahwa akun ini adalah Owner Bot.'

        ];


        // ======================================================
        // BUAT BAGIAN COMMAND USER
        // ======================================================

        let description =

            '📖 **Daftar Command Bot**\n\n' +

            '👤 **User Commands**\n\n' +

            userCommands.join('\n\n');


        // ======================================================
        // TAMBAHKAN ADMIN COMMAND
        // ======================================================

        if (

            permissionLevel === 'admin' ||

            permissionLevel === 'owner'

        ) {

            description +=

                '\n\n' +

                '━━━━━━━━━━━━━━━━━━━━━━\n\n' +

                '🛡️ **Admin Bot Commands**\n\n' +

                adminCommands.join('\n\n');

        }


        // ======================================================
        // TAMBAHKAN OWNER COMMAND
        // ======================================================

        if (

            permissionLevel === 'owner'

        ) {

            description +=

                '\n\n' +

                '━━━━━━━━━━━━━━━━━━━━━━\n\n' +

                '👑 **Owner Commands**\n\n' +

                ownerCommands.join('\n\n');

        }


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
                // DESCRIPTION
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
                // TIMESTAMP
                // ------------------------------------------

                .setTimestamp();


        // ======================================================
        // KIRIM EMBED
        // ======================================================

        return message.reply({

            embeds: [

                embed

            ]

        });

    }

};
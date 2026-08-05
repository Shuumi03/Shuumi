const {
    addServer
} = require('../config/serverConfig');

const {
    isOwnerOrAdmin
} = require('../config/permissions');


module.exports = {

    name: 'addserver',


    async execute(
        message,
        args
    ) {

        // ==================================================
        // CEK PERMISSION OWNER / ADMIN BOT
        // ==================================================

        if (
            !isOwnerOrAdmin(
                message.author.id
            )
        ) {

            return message.reply(

                '❌ Kamu tidak memiliki izin untuk menggunakan command ini.\n\n' +

                'Command ini hanya dapat digunakan oleh **Owner Bot** dan **Admin Bot**.'
            );

        }


        // ==================================================
        // CEK FORMAT COMMAND
        // ==================================================

        if (
            args.length < 3
        ) {

            return message.reply(

                '❌ Format command salah.\n\n' +

                'Gunakan:\n' +

                '`.addserver (nama server) (kode cfx) (alias)`\n\n' +

                'Contoh:\n' +

                '`.addserver satumimpi 6gk4e4 sm`'
            );

        }


        // ==================================================
        // AMBIL DATA
        // ==================================================

        const serverName =
            args[0];

        const cfxId =
            args[1];

        const alias =
            args[2];


        // ==================================================
        // VALIDASI CFX ID
        // ==================================================

        if (
            !/^[a-zA-Z0-9]+$/.test(
                cfxId
            )
        ) {

            return message.reply(

                '❌ Kode CFX tidak valid.'
            );

        }


        // ==================================================
        // VALIDASI ALIAS
        // ==================================================

        if (
            !/^[a-zA-Z0-9_-]+$/.test(
                alias
            )
        ) {

            return message.reply(

                '❌ Alias server hanya boleh berisi huruf, angka, underscore (_) atau tanda minus (-).'
            );

        }


        // ==================================================
        // TAMBAHKAN SERVER
        // ==================================================

        const result =

            addServer(

                serverName,

                cfxId,

                alias
            );


        // ==================================================
        // JIKA GAGAL
        // ==================================================

        if (
            !result.success
        ) {

            return message.reply(

                `❌ ${result.message}`
            );

        }


        // ==================================================
        // BERHASIL
        // ==================================================

        return message.reply(

            `✅ **Server berhasil ditambahkan!**\n\n` +

            `**Nama Server:** ${result.server.name}\n` +

            `**CFX ID:** ${result.server.cfxId}\n` +

            `**Alias:** ${result.server.alias}`
        );

    }

};
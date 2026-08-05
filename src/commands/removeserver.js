const {
    removeServer
} = require('../config/serverConfig');


const {
    isOwnerOrAdmin
} = require('../config/permissions');


module.exports = {

    name: 'removeserver',


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
            args.length < 1
        ) {

            return message.reply(

                '❌ Format command salah.\n\n' +

                'Gunakan:\n' +

                '`.removeserver (nama server/alias)`\n\n' +

                'Contoh:\n' +

                '`.removeserver sm`\n' +

                '`.removeserver satumimpi`'
            );

        }


        // ==================================================
        // AMBIL NAMA / ALIAS SERVER
        // ==================================================

        const serverInput =
            args[0];


        // ==================================================
        // HAPUS SERVER
        // ==================================================

        const result =

            removeServer(
                serverInput
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

            `🗑️ **Server berhasil dihapus!**\n\n` +

            `**Nama Server:** ${result.server.name}\n` +

            `**CFX ID:** ${result.server.cfxId}\n` +

            `**Alias:** ${result.server.alias}`
        );

    }

};
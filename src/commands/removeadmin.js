const {
    isOwner,
    isAdmin,
    removeAdmin
} = require('../config/permissions');


module.exports = {

    name: 'removeadmin',


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

                '❌ Hanya **Owner Bot** yang dapat menghapus Admin Bot.'

            );

        }


        // ==================================================
        // CEK FORMAT
        // ==================================================

        if (
            args.length < 1
        ) {

            return message.reply(

                '❌ Format command salah.\n\n' +

                'Gunakan:\n' +

                '`.removeadmin @User`'

            );

        }


        // ==================================================
        // AMBIL USER
        // ==================================================

        const user =
            message.mentions.users.first();


        if (
            !user
        ) {

            return message.reply(

                '❌ Silakan mention Admin Bot yang ingin dihapus.'

            );

        }


        // ==================================================
        // CEK ADMIN
        // ==================================================

        if (
            !isAdmin(
                user.id
            )
        ) {

            return message.reply(

                '❌ User tersebut bukan merupakan **Admin Bot**.'

            );

        }


        // ==================================================
        // HAPUS ADMIN
        // ==================================================

        const success =
            removeAdmin(
                user.id
            );


        if (
            !success
        ) {

            return message.reply(

                '❌ Admin Bot gagal dihapus.'

            );

        }


        // ==================================================
        // BERHASIL
        // ==================================================

        return message.reply(

            `✅ **Admin Bot berhasil dihapus!**\n\n` +

            `👤 User: ${user}\n` +

            `🆔 ID: \`${user.id}\``

        );

    }

};
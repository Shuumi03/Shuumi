const {
    isOwner,
    isAdmin,
    addAdmin
} = require('../config/permissions');


module.exports = {

    name: 'addadmin',


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

                '❌ Hanya **Owner Bot** yang dapat menambahkan Admin Bot.'

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

                '`.addadmin @User`'

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

                '❌ Silakan mention user Discord yang ingin dijadikan Admin Bot.'

            );

        }


        // ==================================================
        // CEK OWNER
        // ==================================================

        if (
            isOwner(
                user.id
            )
        ) {

            return message.reply(

                '❌ User tersebut sudah merupakan **Owner Bot**.'

            );

        }


        // ==================================================
        // CEK ADMIN
        // ==================================================

        if (
            isAdmin(
                user.id
            )
        ) {

            return message.reply(

                '❌ User tersebut sudah menjadi **Admin Bot**.'

            );

        }


        // ==================================================
        // TAMBAHKAN ADMIN
        // ==================================================

        const success =
            addAdmin(
                user.id
            );


        if (
            !success
        ) {

            return message.reply(

                '❌ Admin Bot gagal disimpan.'

            );

        }


        // ==================================================
        // BERHASIL
        // ==================================================

        return message.reply(

            `🛡️ **Admin Bot berhasil ditambahkan!**\n\n` +

            `👤 User: ${user}\n` +

            `🆔 ID: \`${user.id}\``

        );

    }

};
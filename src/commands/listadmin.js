const {
    isOwner,
    getAllAdmins
} = require('../config/permissions');


// ======================================================
// COMMAND .LISTADMIN
// ======================================================

module.exports = {

    name: 'listadmin',


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

                '❌ Hanya **Owner Bot** yang dapat melihat daftar Admin Bot.'

            );

        }


        // ==================================================
        // AMBIL SEMUA ADMIN
        // ==================================================

        const admins =
            getAllAdmins();


        // ==================================================
        // BELUM ADA ADMIN
        // ==================================================

        if (
            admins.length === 0
        ) {

            return message.reply(

                '🛡️ **Daftar Admin Bot**\n\n' +

                '❌ Belum ada Admin Bot yang terdaftar.'

            );

        }


        // ==================================================
        // BUAT DAFTAR ADMIN
        // ==================================================

        const adminList =

            admins

                .map(

                    (
                        id,
                        index
                    ) =>

                        `${index + 1}. <@${id}> \`${id}\``

                )

                .join(

                    '\n'

                );


        // ==================================================
        // KIRIM HASIL
        // ==================================================

        return message.reply(

            `🛡️ **Daftar Admin Bot**\n\n` +

            adminList

        );

    }

};
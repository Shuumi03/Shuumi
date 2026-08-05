const {
    isOwner
} = require('../config/permissions');


module.exports = {

    name: 'owner',


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

                '❌ Kamu tidak memiliki akses Owner.'
            );

        }


        // ==================================================
        // OWNER BERHASIL
        // ==================================================

        return message.reply(

            '👑 Kamu adalah **Owner Bot**.'
        );

    }

};
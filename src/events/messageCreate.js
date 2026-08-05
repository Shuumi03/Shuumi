const PREFIX = '.';

const {
    addLog
} = require('../services/fivem/logService');


module.exports = {

    name: 'messageCreate',


    async execute(
        message
    ) {

        // ======================================================
        // ABAIKAN PESAN DARI BOT
        // ======================================================

        if (
            message.author.bot
        ) {

            return;

        }


        // ======================================================
        // CEK PREFIX
        // ======================================================

        if (
            !message.content.startsWith(PREFIX)
        ) {

            return;

        }


        // ======================================================
        // PISAHKAN COMMAND DAN ARGUMENT
        // ======================================================

        const args =

            message.content

                .slice(
                    PREFIX.length
                )

                .trim()

                .split(
                    /\s+/
                );


        // ======================================================
        // AMBIL NAMA COMMAND
        // ======================================================

        const commandName =

            args

                .shift()

                .toLowerCase();


        // ======================================================
        // CARI COMMAND
        // ======================================================

        const command =

            message.client.commands.get(

                commandName

            );


        // ======================================================
        // COMMAND TIDAK DITEMUKAN
        // ======================================================

        if (
            !command
        ) {

            return;

        }


        // ======================================================
        // SIMPAN LOG AKTIVITAS
        // ======================================================

        addLog({

            message,

            command:
                commandName,

            args

        });


        // ======================================================
        // JALANKAN COMMAND
        // ======================================================

        try {

            await command.execute(

                message,

                args

            );

        } catch (
            error
        ) {

            // ==================================================
            // TAMPILKAN ERROR DI TERMINAL
            // ==================================================

            console.error(

                `Error pada command .${commandName}:`,

                error

            );


            // ==================================================
            // KIRIM PESAN ERROR KE DISCORD
            // ==================================================

            try {

                await message.reply(

                    '❌ Terjadi kesalahan saat menjalankan command.'

                );

            } catch (
                replyError
            ) {

                console.error(

                    'Gagal mengirim pesan error:',

                    replyError

                );

            }

        }

    }

};
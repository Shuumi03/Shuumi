const fs = require('fs');
const path = require('path');

function loadCommands(client) {

    // ======================================================
    // BUAT COLLECTION COMMAND
    // ======================================================

    client.commands = new Map();


    // ======================================================
    // LOKASI FOLDER COMMAND
    // ======================================================

    const commandsPath =
        path.join(
            __dirname,
            '..',
            'commands'
        );


    // ======================================================
    // AMBIL SEMUA FILE COMMAND
    // ======================================================

    const commandFiles =
        fs
            .readdirSync(
                commandsPath
            )
            .filter(
                file =>
                    file.endsWith('.js')
            );


    // ======================================================
    // LOAD SETIAP COMMAND
    // ======================================================

    for (
        const file of commandFiles
    ) {

        const filePath =
            path.join(
                commandsPath,
                file
            );


        const command =
            require(
                filePath
            );


        // ==================================================
        // CEK COMMAND
        // ==================================================

        if (
            !command.name ||
            !command.execute
        ) {

            console.log(
                `⚠️ Command ${file} tidak valid.`
            );

            continue;
        }


        // ==================================================
        // MASUKKAN COMMAND KE COLLECTION
        // ==================================================

        client.commands.set(

            command.name.toLowerCase(),

            command
        );


        // ==================================================
        // LOG COMMAND
        // ==================================================

        console.log(
            `Load Command -> .${command.name}`
        );
    }


    // ======================================================
    // JUMLAH COMMAND
    // ======================================================

    console.log(
        `Total command berhasil dimuat: ${client.commands.size}`
    );
}


module.exports = {
    loadCommands
};
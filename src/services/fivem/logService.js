const fs = require('fs');
const path = require('path');


// ======================================================
// LOKASI FILE DATA LOG
// ======================================================

const DATA_FILE = path.join(
    __dirname,
    '../data/logs.json'
);


// ======================================================
// BATAS JUMLAH LOG
// ======================================================

const MAX_LOGS = 1000;


// ======================================================
// PASTIKAN FOLDER DAN FILE TERSEDIA
// ======================================================

function ensureLogFile() {

    try {

        const dataDirectory =
            path.dirname(
                DATA_FILE
            );


        // ==================================================
        // BUAT FOLDER DATA JIKA BELUM ADA
        // ==================================================

        if (
            !fs.existsSync(
                dataDirectory
            )
        ) {

            fs.mkdirSync(
                dataDirectory,
                {
                    recursive: true
                }
            );

        }


        // ==================================================
        // BUAT FILE LOG JIKA BELUM ADA
        // ==================================================

        if (
            !fs.existsSync(
                DATA_FILE
            )
        ) {

            fs.writeFileSync(

                DATA_FILE,

                JSON.stringify(
                    [],
                    null,
                    4
                )

            );

        }

    } catch (error) {

        console.error(
            'Gagal menyiapkan file log:',
            error
        );

    }

}


// ======================================================
// BACA SEMUA LOG
// ======================================================

function loadLogs() {

    try {

        ensureLogFile();


        const data =
            fs.readFileSync(
                DATA_FILE,
                'utf8'
            );


        const logs =
            JSON.parse(
                data
            );


        if (
            !Array.isArray(
                logs
            )
        ) {

            return [];

        }


        return logs;

    } catch (error) {

        console.error(
            'Gagal membaca data log:',
            error
        );


        return [];

    }

}


// ======================================================
// SIMPAN SEMUA LOG
// ======================================================

function saveLogs(
    logs
) {

    try {

        ensureLogFile();


        fs.writeFileSync(

            DATA_FILE,

            JSON.stringify(
                logs,
                null,
                4
            )

        );


        return true;

    } catch (error) {

        console.error(
            'Gagal menyimpan data log:',
            error
        );


        return false;

    }

}


// ======================================================
// TAMBAHKAN LOG BARU
// ======================================================

function addLog({

    message,

    command,

    args = []

}) {

    try {

        const logs =
            loadLogs();


        // ==================================================
        // BUAT DATA LOG
        // ==================================================

        const newLog = {

            timestamp:
                new Date().toISOString(),

            username:
                message.author
                    ? message.author.tag
                    : 'Unknown',

            userId:
                message.author
                    ? message.author.id
                    : 'Unknown',

            command:
                command
                    ? command
                    : 'unknown',

            args:
                Array.isArray(args)
                    ? args
                    : [],

            guildId:
                message.guild
                    ? message.guild.id
                    : null,

            guildName:
                message.guild
                    ? message.guild.name
                    : 'DM',

            channelId:
                message.channel
                    ? message.channel.id
                    : null,

            channelName:
                message.channel &&
                message.channel.name
                    ? message.channel.name
                    : 'Unknown'

        };


        // ==================================================
        // MASUKKAN LOG TERBARU KE AWAL ARRAY
        // ==================================================

        logs.unshift(
            newLog
        );


        // ==================================================
        // BATASI JUMLAH LOG
        // ==================================================

        if (
            logs.length >
            MAX_LOGS
        ) {

            logs.splice(

                MAX_LOGS

            );

        }


        // ==================================================
        // SIMPAN LOG
        // ==================================================

        return saveLogs(
            logs
        );

    } catch (error) {

        console.error(
            'Gagal menambahkan log:',
            error
        );


        return false;

    }

}


// ======================================================
// AMBIL LOG
// ======================================================

function getLogs(
    limit = 10
) {

    const logs =
        loadLogs();


    const safeLimit =
        Math.max(

            1,

            Math.min(

                Number(
                    limit
                ) || 10,

                50

            )

        );


    return logs.slice(

        0,

        safeLimit

    );

}


// ======================================================
// HAPUS SEMUA LOG
// ======================================================

function clearLogs() {

    return saveLogs(
        []
    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    addLog,

    getLogs,

    clearLogs,

    loadLogs,

    saveLogs

};
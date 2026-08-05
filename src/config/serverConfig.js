const fs = require('fs');
const path = require('path');


// ======================================================
// LOKASI FILE DATA SERVER
// ======================================================

const DATA_FILE = path.join(
    __dirname,
    '../data/servers.json'
);


// ======================================================
// BACA DATA SERVER
// ======================================================

function loadServers() {

    try {

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

            return [];

        }


        const data =
            fs.readFileSync(
                DATA_FILE,
                'utf8'
            );


        return JSON.parse(
            data
        );

    } catch (error) {

        console.error(
            'Gagal membaca data server:',
            error
        );

        return [];

    }

}


// ======================================================
// SIMPAN DATA SERVER
// ======================================================

function saveServers(
    servers
) {

    try {

        fs.writeFileSync(

            DATA_FILE,

            JSON.stringify(
                servers,
                null,
                4
            )

        );

        return true;

    } catch (error) {

        console.error(
            'Gagal menyimpan data server:',
            error
        );

        return false;

    }

}


// ======================================================
// CARI SERVER BERDASARKAN NAMA / ALIAS
// ======================================================

function getServer(
    input
) {

    if (
        !input
    ) {

        return null;

    }


    const servers =
        loadServers();


    const search =
        input
            .toLowerCase()
            .trim();


    return servers.find(
        server =>

            server.name
                .toLowerCase() ===
            search

            ||

            server.alias
                .toLowerCase() ===
            search

    ) || null;

}


// ======================================================
// TAMBAHKAN SERVER
// ======================================================

function addServer(
    name,
    cfxId,
    alias
) {

    const servers =
        loadServers();


    // ==================================================
    // CEK NAMA SERVER
    // ==================================================

    const nameExists =
        servers.some(
            server =>

                server.name
                    .toLowerCase() ===
                name
                    .toLowerCase()
        );


    if (
        nameExists
    ) {

        return {

            success: false,

            message:
                'Nama server sudah terdaftar.'

        };

    }


    // ==================================================
    // CEK ALIAS
    // ==================================================

    const aliasExists =
        servers.some(
            server =>

                server.alias
                    .toLowerCase() ===
                alias
                    .toLowerCase()
        );


    if (
        aliasExists
    ) {

        return {

            success: false,

            message:
                'Alias server sudah digunakan.'

        };

    }


    // ==================================================
    // CEK CFX ID
    // ==================================================

    const cfxExists =
        servers.some(
            server =>

                server.cfxId
                    .toLowerCase() ===
                cfxId
                    .toLowerCase()
        );


    if (
        cfxExists
    ) {

        return {

            success: false,

            message:
                'CFX ID server sudah terdaftar.'

        };

    }


    // ==================================================
    // BUAT SERVER BARU
    // ==================================================

    const newServer = {

        name:
            name,

        cfxId:
            cfxId,

        alias:
            alias

    };


    // ==================================================
    // TAMBAHKAN KE DATA
    // ==================================================

    servers.push(
        newServer
    );


    // ==================================================
    // SIMPAN KE FILE
    // ==================================================

    const saved =
        saveServers(
            servers
        );


    if (
        !saved
    ) {

        return {

            success: false,

            message:
                'Server gagal disimpan ke database.'

        };

    }


    return {

        success: true,

        server:
            newServer

    };

}


// ======================================================
// HAPUS SERVER
// ======================================================

function removeServer(
    input
) {

    if (
        !input
    ) {

        return {

            success: false,

            message:
                'Nama server atau alias tidak boleh kosong.'

        };

    }


    const servers =
        loadServers();


    const search =
        input
            .toLowerCase()
            .trim();


    const index =
        servers.findIndex(
            server =>

                server.name
                    .toLowerCase() ===
                search

                ||

                server.alias
                    .toLowerCase() ===
                search
        );


    // ==================================================
    // SERVER TIDAK DITEMUKAN
    // ==================================================

    if (
        index === -1
    ) {

        return {

            success: false,

            message:
                `Server dengan nama atau alias **${input}** tidak ditemukan.`

        };

    }


    // ==================================================
    // SIMPAN DATA SERVER
    // ==================================================

    const removedServer =
        servers[index];


    // ==================================================
    // HAPUS SERVER
    // ==================================================

    servers.splice(
        index,
        1
    );


    // ==================================================
    // SIMPAN PERUBAHAN
    // ==================================================

    const saved =
        saveServers(
            servers
        );


    if (
        !saved
    ) {

        return {

            success: false,

            message:
                'Server gagal dihapus dari database.'

        };

    }


    return {

        success: true,

        server:
            removedServer

    };

}


// ======================================================
// AMBIL SEMUA SERVER
// ======================================================

function getAllServers() {

    return loadServers();

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getServer,

    addServer,

    removeServer,

    getAllServers

};
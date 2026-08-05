const fs = require('fs');
const path = require('path');


// ======================================================
// OWNER CONFIGURATION
// ======================================================

const OWNER_IDS = [
    '543786924389826570'
];


// ======================================================
// LOKASI FILE DATA ADMIN
// ======================================================

const DATA_FILE = path.join(
    __dirname,
    '../data/admins.json'
);


// ======================================================
// BACA DATA ADMIN
// ======================================================

function loadAdmins() {

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
            'Gagal membaca data Admin Bot:',
            error
        );

        return [];

    }

}


// ======================================================
// SIMPAN DATA ADMIN
// ======================================================

function saveAdmins(
    admins
) {

    try {

        fs.writeFileSync(

            DATA_FILE,

            JSON.stringify(
                admins,
                null,
                4
            )

        );

        return true;

    } catch (error) {

        console.error(
            'Gagal menyimpan data Admin Bot:',
            error
        );

        return false;

    }

}


// ======================================================
// CEK OWNER
// ======================================================

function isOwner(
    userId
) {

    return OWNER_IDS.includes(
        userId
    );

}


// ======================================================
// CEK ADMIN BOT
// ======================================================

function isAdmin(
    userId
) {

    const admins =
        loadAdmins();


    return admins.includes(
        userId
    );

}


// ======================================================
// CEK OWNER ATAU ADMIN BOT
// ======================================================

function isOwnerOrAdmin(
    userId
) {

    return (

        isOwner(
            userId
        )

        ||

        isAdmin(
            userId
        )

    );

}


// ======================================================
// TAMBAH ADMIN BOT
// ======================================================

function addAdmin(
    userId
) {

    const admins =
        loadAdmins();


    if (
        admins.includes(
            userId
        )
    ) {

        return false;

    }


    admins.push(
        userId
    );


    return saveAdmins(
        admins
    );

}


// ======================================================
// HAPUS ADMIN BOT
// ======================================================

function removeAdmin(
    userId
) {

    const admins =
        loadAdmins();


    const index =
        admins.indexOf(
            userId
        );


    if (
        index === -1
    ) {

        return false;

    }


    admins.splice(
        index,
        1
    );


    return saveAdmins(
        admins
    );

}


// ======================================================
// AMBIL SEMUA ADMIN
// ======================================================

function getAllAdmins() {

    return loadAdmins();

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    OWNER_IDS,

    isOwner,

    isAdmin,

    isOwnerOrAdmin,

    addAdmin,

    removeAdmin,

    getAllAdmins

};
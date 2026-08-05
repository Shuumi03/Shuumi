const API_BASE_URL =
    'https://frontend.cfx-services.net/api/servers/single';


// ======================================================
// KONFIGURASI REQUEST API
// ======================================================

// Maksimal waktu menunggu response API
const REQUEST_TIMEOUT = 10000;

// Jumlah percobaan ulang setelah request gagal
const MAX_RETRIES = 2;


// ======================================================
// FUNGSI DELAY
// ======================================================

function delay(milliseconds) {

    return new Promise((resolve) => {

        setTimeout(
            resolve,
            milliseconds
        );

    });

}


// ======================================================
// FUNGSI REQUEST DATA SERVER
// ======================================================

async function getServerData(serverId) {

    // ==================================================
    // VALIDASI CFX ID
    // ==================================================

    if (!serverId) {

        throw new Error(
            'CFX Server ID tidak boleh kosong.'
        );

    }


    // ==================================================
    // BERSIHKAN CFX ID
    // ==================================================

    const cleanServerId = String(serverId)
        .replace(/^cfx:/i, '')
        .trim();


    // ==================================================
    // VALIDASI CFX ID
    // ==================================================

    if (!cleanServerId) {

        throw new Error(
            'CFX Server ID tidak valid.'
        );

    }


    // ==================================================
    // BUAT URL API
    // ==================================================

    const url =
        API_BASE_URL +
        '/' +
        encodeURIComponent(
            cleanServerId
        );


    // ==================================================
    // REQUEST + RETRY
    // ==================================================

    for (
        let attempt = 1;
        attempt <= MAX_RETRIES + 1;
        attempt++
    ) {

        // ==================================================
        // BUAT ABORT CONTROLLER
        // ==================================================

        const controller =
            new AbortController();


        // ==================================================
        // SET TIMEOUT
        // ==================================================

        const timeout = setTimeout(

            () => {

                controller.abort();

            },

            REQUEST_TIMEOUT

        );


        try {

            // ==================================================
            // REQUEST KE API FIVEM
            // ==================================================

            const response = await fetch(

                url,

                {

                    method:
                        'GET',

                    headers: {

                        'Accept':
                            'application/json',

                        'User-Agent':
                            'Petuah-Bukan-Nabi/1.0'

                    },

                    signal:
                        controller.signal

                }

            );


            // ==================================================
            // HENTIKAN TIMEOUT
            // ==================================================

            clearTimeout(
                timeout
            );


            // ==================================================
            // SERVER TIDAK DITEMUKAN
            // ==================================================

            if (
                response.status === 404
            ) {

                throw new Error(

                    'Server dengan CFX ID "' +
                    cleanServerId +
                    '" tidak ditemukan oleh API.'

                );

            }


            // ==================================================
            // ERROR HTTP
            // ==================================================

            if (
                !response.ok
            ) {

                throw new Error(

                    'FiveM API mengembalikan HTTP ' +
                    response.status +
                    ' ' +
                    response.statusText

                );

            }


            // ==================================================
            // BACA RESPONSE JSON
            // ==================================================

            const json =
                await response.json();


            // ==================================================
            // VALIDASI RESPONSE
            // ==================================================

            if (
                !json ||
                !json.Data
            ) {

                throw new Error(

                    'Response API tidak memiliki data server yang valid.'

                );

            }


            // ==================================================
            // REQUEST BERHASIL
            // ==================================================

            return json;


        } catch (error) {

            // ==================================================
            // HENTIKAN TIMEOUT
            // ==================================================

            clearTimeout(
                timeout
            );


            // ==================================================
            // JIKA TIMEOUT
            // ==================================================

            if (
                error.name === 'AbortError'
            ) {

                // ==============================================
                // MASIH ADA PERCOBAAN
                // ==============================================

                if (
                    attempt <= MAX_RETRIES
                ) {

                    console.warn(

                        'Request API FiveM timeout. ' +
                        'Percobaan ' +
                        attempt +
                        '/' +
                        (MAX_RETRIES + 1) +
                        '. Mencoba kembali...'

                    );


                    await delay(
                        1000
                    );


                    continue;

                }


                // ==============================================
                // SEMUA PERCOBAAN HABIS
                // ==============================================

                throw new Error(

                    'API FiveM tidak merespons dalam ' +
                    (REQUEST_TIMEOUT / 1000) +
                    ' detik setelah ' +
                    (MAX_RETRIES + 1) +
                    ' kali percobaan.'

                );

            }


            // ==================================================
            // JIKA SERVER TIDAK DITEMUKAN
            // JANGAN RETRY
            // ==================================================

            if (

                error.message &&

                error.message.includes(
                    'tidak ditemukan oleh API'
                )

            ) {

                throw error;

            }


            // ==================================================
            // JIKA MASIH ADA PERCOBAAN
            // ==================================================

            if (
                attempt <= MAX_RETRIES
            ) {

                console.warn(

                    'Request API FiveM gagal. ' +
                    'Percobaan ' +
                    attempt +
                    '/' +
                    (MAX_RETRIES + 1) +
                    '. Error: ' +
                    error.message +
                    '. Mencoba kembali...'

                );


                await delay(
                    1000
                );


                continue;

            }


            // ==================================================
            // SEMUA PERCOBAAN HABIS
            // ==================================================

            throw new Error(

                'Gagal mengakses API FiveM setelah ' +
                (MAX_RETRIES + 1) +
                ' kali percobaan. Error: ' +
                error.message

            );

        }

    }


    // ======================================================
    // FALLBACK ERROR
    // ======================================================

    throw new Error(

        'Gagal mendapatkan data dari API FiveM.'

    );

}


// ======================================================
// FUNGSI MENGAMBIL DATA PLAYER
// ======================================================

async function getPlayers(serverId) {

    // ==================================================
    // AMBIL DATA SERVER
    // ==================================================

    const serverData =
        await getServerData(
            serverId
        );


    // ==================================================
    // AMBIL DATA PLAYER
    // ==================================================

    return {

        serverData,

        players:

            Array.isArray(
                serverData.Data.players
            )

                ? serverData.Data.players

                : []

    };

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getServerData,

    getPlayers

};
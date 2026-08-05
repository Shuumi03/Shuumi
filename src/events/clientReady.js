const {
    liveMonitors,
    createMonitorKey,
    loadLiveMonitors,
    startMonitorInterval,
    updateLiveMonitor
} = require('../commands/live');

const {
    getServer
} = require('../config/serverConfig');


// ======================================================
// EVENT CLIENT READY
// ======================================================

module.exports = {

    name: 'clientReady',

    once: true,


    async execute(
        client
    ) {

        console.log(

            `Bot berhasil online sebagai ${client.user.tag}`

        );


        // ==================================================
        // BACA DATA DARI JSON
        // ==================================================

        const savedMonitors =

            loadLiveMonitors();


        // ==================================================
        // CEK DATA
        // ==================================================

        if (
            savedMonitors.length === 0
        ) {

            console.log(

                '[Live Recovery] Tidak ada monitoring yang perlu dipulihkan.'

            );

            return;

        }


        console.log(

            `[Live Recovery] Menemukan ${savedMonitors.length} monitoring.`

        );


        // ==================================================
        // MONITORING YANG BERHASIL DIPULIHKAN
        // ==================================================

        let recoveredCount = 0;


        // ==================================================
        // MONITORING YANG GAGAL DIPULIHKAN
        // ==================================================

        const failedMonitors = [];


        // ==================================================
        // LOOP SEMUA DATA MONITORING
        // ==================================================

        for (
            const savedMonitor
            of savedMonitors
        ) {

            try {

                console.log(

                    `[Live Recovery] Memulihkan: ` +

                    `${savedMonitor.serverName} - ` +

                    `${savedMonitor.searchName}`

                );


                // ==========================================
                // CARI SERVER
                // ==========================================

                const server =

                    getServer(

                        savedMonitor.serverAlias

                    );


                if (
                    !server
                ) {

                    console.error(

                        `[Live Recovery] Server tidak ditemukan: ` +

                        `${savedMonitor.serverAlias}`

                    );


                    failedMonitors.push(

                        savedMonitor

                    );


                    continue;

                }


                console.log(

                    `[Live Recovery] Server ditemukan: ` +

                    `${server.name}`

                );


                // ==========================================
                // AMBIL CHANNEL
                // ==========================================

                const channel =

                    await client.channels.fetch(

                        savedMonitor.channelId

                    );


                if (
                    !channel
                ) {

                    throw new Error(

                        'Channel tidak ditemukan.'

                    );

                }


                console.log(

                    `[Live Recovery] Channel ditemukan: ` +

                    `${savedMonitor.channelId}`

                );


                // ==========================================
                // AMBIL PESAN LIVE LAMA
                // ==========================================

                const liveMessage =

                    await channel.messages.fetch(

                        savedMonitor.messageId

                    );


                if (
                    !liveMessage
                ) {

                    throw new Error(

                        'Pesan Live tidak ditemukan.'

                    );

                }


                console.log(

                    `[Live Recovery] Pesan Live ditemukan: ` +

                    `${savedMonitor.messageId}`

                );


                // ==========================================
                // BUAT MONITOR KEY
                // ==========================================

                const monitorKey =

                    createMonitorKey(

                        savedMonitor.guildId,

                        savedMonitor.serverAlias,

                        savedMonitor.searchName

                    );


                // ==========================================
                // BUAT OBJECT MONITOR
                // ==========================================

                const monitor = {

                    messageId:
                        savedMonitor.messageId,

                    channelId:
                        savedMonitor.channelId,

                    guildId:
                        savedMonitor.guildId,

                    serverAlias:
                        savedMonitor.serverAlias,

                    serverName:
                        savedMonitor.serverName,

                    searchName:
                        savedMonitor.searchName,

                    interval:
                        null,

                    client:
                        client

                };


                // ==========================================
                // MASUKKAN KE MAP
                // ==========================================

                liveMonitors.set(

                    monitorKey,

                    monitor

                );


                // ==========================================
                // UPDATE EMBED LANGSUNG
                // ==========================================

                await updateLiveMonitor(

                    monitor

                );


                // ==========================================
                // MULAI INTERVAL 15 DETIK
                // ==========================================

                startMonitorInterval(

                    monitor

                );


                recoveredCount++;


                console.log(

                    `[Live Recovery] Monitoring berhasil dipulihkan: ` +

                    `${savedMonitor.serverName} - ` +

                    `${savedMonitor.searchName}`

                );


            } catch (error) {

                console.error(

                    `[Live Recovery] Gagal memulihkan monitoring: ` +

                    `${savedMonitor.serverName} - ` +

                    `${savedMonitor.searchName}`,

                    error

                );


                // ==========================================
                // MASUKKAN KE DAFTAR GAGAL
                // ==========================================

                failedMonitors.push(

                    savedMonitor

                );

            }

        }


        // ==================================================
        // TAMPILKAN HASIL RECOVERY
        // ==================================================

        console.log(

            `[Live Recovery] Selesai. ` +

            `${recoveredCount}/${savedMonitors.length} ` +

            `monitoring berhasil dipulihkan.`

        );


        // ==================================================
        // CATAT MONITORING YANG GAGAL
        // ==================================================

        if (
            failedMonitors.length > 0
        ) {

            console.log(

                `[Live Recovery] ` +

                `${failedMonitors.length} monitoring gagal dipulihkan.`

            );

        }


        // ==================================================
        // PENTING:
        // TIDAK ADA saveLiveMonitors() DI SINI
        //
        // Data JSON TIDAK akan ditimpa.
        // ==================================================

    }

};
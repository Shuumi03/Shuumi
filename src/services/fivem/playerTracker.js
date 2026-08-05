const playerTracker = new Map();

function createPlayerKey(serverId, player) {
    return `${serverId}:${player.id}`;
}

function updatePlayerTracker(serverId, players) {
    const now = Date.now();

    const currentPlayerKeys = new Set();

    for (const player of players) {
        const key = createPlayerKey(
            serverId,
            player
        );

        currentPlayerKeys.add(key);

        if (!playerTracker.has(key)) {
            playerTracker.set(key, {
                serverId,
                playerId: player.id,
                playerName: player.name,
                firstSeen: now,
                lastSeen: now
            });
        } else {
            const existingPlayer =
                playerTracker.get(key);

            existingPlayer.playerName =
                player.name;

            existingPlayer.lastSeen =
                now;
        }
    }

    for (const [
        key,
        trackedPlayer
    ] of playerTracker.entries()) {

        if (
            trackedPlayer.serverId === serverId &&
            !currentPlayerKeys.has(key)
        ) {
            playerTracker.delete(key);
        }
    }
}

function getPlayerOnlineTime(
    serverId,
    playerId
) {
    const key =
        `${serverId}:${playerId}`;

    const trackedPlayer =
        playerTracker.get(key);

    if (!trackedPlayer) {
        return 0;
    }

    return Date.now() -
        trackedPlayer.firstSeen;
}

function formatOnlineTime(
    milliseconds
) {
    const totalSeconds =
        Math.floor(
            milliseconds / 1000
        );

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) /
            3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) /
            60
        );

    const seconds =
        totalSeconds % 60;

    if (days > 0) {
        return `${days} hari ${hours} jam`;
    }

    if (hours > 0) {
        return `${hours} jam ${minutes} menit`;
    }

    if (minutes > 0) {
        return `${minutes} menit ${seconds} detik`;
    }

    return `${seconds} detik`;
}

module.exports = {
    updatePlayerTracker,
    getPlayerOnlineTime,
    formatOnlineTime
};
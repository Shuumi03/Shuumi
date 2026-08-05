function parsePlayer(player) {
    if (!player) {
        return null;
    }

    const identifiers = Array.isArray(player.identifiers)
        ? player.identifiers
        : [];

    const steamIdentifier = identifiers.find(
        (identifier) => identifier.startsWith('steam:')
    );

    const discordIdentifier = identifiers.find(
        (identifier) => identifier.startsWith('discord:')
    );

    return {
        name: player.name || 'Unknown',
        id: player.id ?? 'Unknown',
        ping: player.ping ?? 'Unknown',
        steam: steamIdentifier
            ? steamIdentifier.replace('steam:', '')
            : null,
        discord: discordIdentifier
            ? discordIdentifier.replace('discord:', '')
            : null,
        identifiers
    };
}

function parsePlayers(players) {
    if (!Array.isArray(players)) {
        return [];
    }

    return players
        .map(parsePlayer)
        .filter(Boolean);
}

function findPlayerByName(players, searchName) {
    if (!Array.isArray(players)) {
        return null;
    }

    if (!searchName) {
        return null;
    }

    const search = searchName.toLowerCase().trim();

    return players.find((player) => {
        if (!player.name) {
            return false;
        }

        return player.name.toLowerCase() === search;
    }) || null;
}

function findPlayersByName(players, searchName) {
    if (!Array.isArray(players)) {
        return [];
    }

    if (!searchName) {
        return [];
    }

    const search = searchName.toLowerCase().trim();

    return players.filter((player) => {
        if (!player.name) {
            return false;
        }

        return player.name.toLowerCase().includes(search);
    });
}

function findPlayerById(players, playerId) {
    if (!Array.isArray(players)) {
        return null;
    }

    const numericId = Number(playerId);

    return players.find((player) => {
        return Number(player.id) === numericId;
    }) || null;
}

module.exports = {
    parsePlayer,
    parsePlayers,
    findPlayerByName,
    findPlayersByName,
    findPlayerById
};
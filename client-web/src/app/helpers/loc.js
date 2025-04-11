const nearLoc = {
    "stockTicker": {
        lat: 13.0045213,
        long: 77.544636,
        acc: 13.65
    },
    "vendingMachine": {
        lat: 13.0046345,
        long: 77.5444103,
        acc: 12.67
    },
    "mbaBridge": {
        lat: 13.0048402,
        long: 77.5442367,
        acc: 2.5
    },
    "mbaAILab": {
        lat: 13.0047431,
        long: 77.5445032,
        acc: 4.9
    },
    "mbaDigitalClassroom": {
        lat: 13.0052077,
        long: 77.5445211,
        acc: 3.18
    },
};

function getDistance(lat1, lon1, lat2, lon2) {
    const toRad = angle => (angle * Math.PI) / 180;
    const R = 6371000; // in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export { getDistance, nearLoc }
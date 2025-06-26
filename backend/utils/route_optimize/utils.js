

const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371.0; // Radius bumi dalam kilometer

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

const generateDistanceMatrix = (customer) => {
    const num = customer.length;
    const matrix = [];

    for (let i = 0; i < num; i++) {
        const row = [];
        for (let j = 0; j < num; j++) {
            if (i === j) {
                row.push(0); // Jarak ke diri sendiri = 0
            } else {
                const d = haversine(
                    customer[i].latitude,
                    customer[i].longitude,
                    customer[j].latitude,
                    customer[j].longitude
                );
                row.push(d);
            }
        }
        matrix.push(row);
    }

    return matrix;
};

const estimateDistanceCapacity = (route, distanceMatrix, customer) => {
    let totalDistance = 0;
    let totalLoad = 0;

    const fullRoute = [...route, 0]; // Tambahkan depot (0) di akhir

    for (let i = 0; i < fullRoute.length - 1; i++) {
        const from = fullRoute[i];
        const to = fullRoute[i + 1];

        const distance = distanceMatrix[from][to];
        totalDistance += distance;
        totalLoad += customer[from]?.volume_sampah ?? 0;
    }
    return { totalDistance, totalLoad };
};


const euclideanDistance = (a, b) => {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

module.exports = {
    euclideanDistance,
    toRadians,
    haversine,
    generateDistanceMatrix,
    estimateDistanceCapacity,
};

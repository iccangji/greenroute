const { euclideanDistance } = require('../utils');

// Inisialisasi centroid
const initializeCentroids = (data, k) => {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, k);
}

// Menentukan cluster
const assignClusters = (data, centroids) => {
    return data.map(point => {
        let minDist = Infinity;
        let cluster = -1;
        centroids.forEach((centroid, i) => {
            const dist = euclideanDistance(point, centroid);
            if (dist < minDist) {
                minDist = dist;
                cluster = i;
            }
        });
        return cluster;
    });
}

const updateCentroids = (data, labels, k) => {
    const sums = Array.from({ length: k }, () => []);
    const counts = Array(k).fill(0);

    data.forEach((point, idx) => {
        const cluster = labels[idx];
        if (!Array.isArray(sums[cluster])) sums[cluster] = [];
        point.forEach((val, dim) => {
            sums[cluster][dim] = (sums[cluster][dim] || 0) + val;
        });
        counts[cluster]++;
    });

    return sums.map((sum, i) => {
        const count = counts[i];
        if (count === 0) {
            return initializeCentroids(data, 1)[0]; // Hindari NaN centroid
        }
        return sum.map(val => val / count);
    });
}


// Melakukan klastering
const kMeans = (data, k, maxIterations = 100) => {
    let centroids = initializeCentroids(data, k); // Inisialisasi centroid
    let labels = [];

    for (let i = 0; i < maxIterations; i++) { // Melakukan iterasi sampai konvergen
        labels = assignClusters(data, centroids); // Menentukan cluster

        const newCentroids = updateCentroids(data, labels, k); // Memperbarui centroid
        const done = centroids.every((c, idx) => // Memeriksa konvergen
            euclideanDistance(c, newCentroids[idx]) < 1e-6 // Jarak antara centroid sebelum dan sesudah konvergen kurang dari 1e-6
        );
        centroids = newCentroids; // Memperbarui centroid


        if (done) break;
    }
    return { centroids, labels }; // Mengembalikan centroid dan label
}

module.exports = {
    kMeans
}
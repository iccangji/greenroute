const { euclideanDistance } = require('../utils');

const silhouetteScore = (data, labels, k) => {
    const n = data.length;
    let totalScore = 0;
    for (let i = 0; i < n; i++) { // Melakukan iterasi untuk setiap data
        const currentPoint = data[i];
        const currentCluster = labels[i];

        let a = 0, b = Infinity;

        const sameCluster = data // Memfilter data yang memiliki label sama dengan currentCluster
            .map((p, j) => ({ p, j }))
            .filter(({ j }) => labels[j] === currentCluster && j !== i);

        if (sameCluster.length > 0) {  // Jika ada data dengan label sama
            a = sameCluster.reduce((sum, { p }) => sum + euclideanDistance(currentPoint, p), 0) / sameCluster.length // Menghitung rata-rata jarak antara currentPoint dan data dengan label sama;
        }

        for (let j = 0; j < k; j++) { // Melakukan iterasi untuk setiap klaster
            if (j === currentCluster) continue;
            const otherCluster = data // Memfilter data yang memiliki label sama dengan j
                .map((p, m) => ({ p, m }))
                .filter(({ m }) => labels[m] === j);

            if (otherCluster.length > 0) { // Jika ada data dengan label j
                const dist = otherCluster.reduce((sum, { p }) => sum + euclideanDistance(currentPoint, p), 0) / otherCluster.length; // Menghitung rata-rata jarak antara currentPoint dan data dengan label j
                if (dist < b) b = dist;
            }
        }

        const s = (b - a) / Math.max(a, b);
        totalScore += s;
    }

    return totalScore / n; // Menghitung rata-rata silhouette score
}

module.exports = {
    silhouetteScore
}
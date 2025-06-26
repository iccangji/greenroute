const { kMeans } = require('./kmeans');
const { silhouetteScore } = require('./silhouette_score');

/**
 * Mengelompokkan data menggunakan KMeans dan memilih jumlah klaster optimal berdasarkan silhouette score.
 * @param {Array<Object>} data - Array objek, masing-masing dengan properti 'latitude' dan 'longitude'.
 * @returns {{ optimalK: number, dataPerCluster: Object<number, Array<Object>> }}
 */


const clusterData = (data) => {
    const coords = data.map(d =>
        d.dataValues ? [d.dataValues.latitude, d.dataValues.longitude] : [d.data.latitude, d.data.longitude]
    );

    // Membuat array jumlah klaster dari 2 hingga 10
    const K_RANGE = Array.from({ length: 9 }, (_, i) => i + 2);
    const scores = [];

    let allLabels = [];

    // Melakukan klastering untuk setiap jumlah klaster
    for (const k of K_RANGE) {
        const result = kMeans(coords, k);
        const labels = result.labels;
        const score = silhouetteScore(coords, labels, k);

        scores.push(score);
        allLabels.push(labels);
    }

    // Menentukan jumlah klaster optimal
    const maxScoreIndex = scores.indexOf(Math.max(...scores));
    // const optimalK = maxScoreIndex + 2;

    const optimalK = 3;

    // console.log(scores);
    // console.log(`Jumlah klaster optimal berdasarkan silhouette score: ${optimalK}`);

    // Melakukan klastering dengan jumlah klaster optimal
    const optimalResult = kMeans(coords, optimalK);
    const optimalLabels = optimalResult.labels;

    // Tambahkan label ke data
    const clusteredData = data.map((d, i) => ({
        data: d.dataValues ? d.dataValues : d.data,
        cluster: optimalLabels[i]
    }));

    // Kelompokkan data per klaster
    const dataPerCluster = {};
    for (const d of clusteredData) {
        if (!dataPerCluster[d.cluster]) {
            dataPerCluster[d.cluster] = [];
        }
        dataPerCluster[d.cluster].push(d);
    }


    return { optimalK, dataPerCluster };
}


module.exports = {
    clusterData
};
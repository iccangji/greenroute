const GA = require('./utils');

// Algoritma Genetika Utama
const geneticAlgorithm = (population, maxGen, crossoverRate, mutationRate, distanceMatrix, popSize, customer, truck) => {
    const n = customer.length - 1;
    const numTrucks = truck.length;

    // Melakukan iterasi sebanyak jumlah generasi
    for (let gen = 0; gen < maxGen; gen++) {
        // Melakukan evaluasi fitness
        const fitness = GA.evaluateFitness(population, distanceMatrix, customer, truck);

        // Melakukan seleksi berdasarkan rank
        const selected = GA.rankSelection(population, fitness, 2);

        // Melakukan crossover
        const [child1, child2] = GA.crossover(selected[0], selected[1], crossoverRate);

        // Melakukan mutasi
        population = GA.generateMutation(selected, [child1, child2], mutationRate, popSize, n, numTrucks);
    }

    // Melakukan evaluasi fitness terakhir
    const finalFitness = GA.evaluateFitness(population, distanceMatrix, customer, truck);

    // Memilih individu terbaik
    const bestIdx = finalFitness.indexOf(Math.max(...finalFitness));

    return { bestChromosome: population[bestIdx], bestFitness: finalFitness[bestIdx] };
}

module.exports = {
    geneticAlgorithm
};

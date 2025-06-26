const { geneticAlgorithm } = require('../ga/genetic_algorithm');
const GA = require('../ga/utils');
const SA = require('./utils');

const simulatedAnnealingMutation = (
    individual, initialTemp, coolingRate, stopTemp,
    distanceMatrix, population, maxGen, crossoverRate,
    mutationRate, popSize, customer, truck
) => {
    let currentSolution = JSON.parse(JSON.stringify(individual));
    let currentEnergy = GA.evaluateFitness([currentSolution], distanceMatrix, customer, truck)[0];
    let temperature = initialTemp;

    const solution = [[currentSolution, currentEnergy]];

    // Melakukan iterasi sampai temperature mencapai batas temperature
    while (temperature > stopTemp) {
        console.log(`Current Temperature: ${temperature}, Current Energy: ${currentEnergy}`);

        // Memeriksa apakah temperature telah mencapai batas temperature
        if (temperature < initialTemp) {
            // Melakukan evaluasi fitness terhadap populasi
            if (currentEnergy <= GA.evaluateFitness([individual], distanceMatrix, customer, truck)[0]) {
                const { bestChromosome, bestFitness } = geneticAlgorithm(
                    population, maxGen, crossoverRate, mutationRate,
                    distanceMatrix, popSize, customer, truck
                );
                currentSolution = bestChromosome;
                currentEnergy = bestFitness;
            }
        }

        // Mencari solusi tetangga
        const neighbor = SA.getNeighbor(currentSolution);

        // Mengevaluasi solusi tetangga
        const neighborEnergy = GA.evaluateFitness([neighbor], distanceMatrix, customer, truck)[0];

        // Menghitung probabilitas akseptasi
        const accProb = SA.acceptanceProbability(currentEnergy, neighborEnergy, temperature);
        if (accProb > Math.random()) {
            currentSolution = neighbor;
            currentEnergy = neighborEnergy;
        }

        // Mengurangi temperature
        temperature = temperature * coolingRate;

        // Menyimpan solusi
        solution.push([JSON.parse(JSON.stringify(currentSolution)), currentEnergy]);
        if (temperature < 1e-10) {
            break
        }
    }

    return solution;
};

module.exports = {
    simulatedAnnealingMutation
};

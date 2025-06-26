const _ = require('lodash');

// Membuat populasi awal
const generateInitialPopulation = (popSize, n, numTrucks) => {
    const population = [];
    for (let i = 0; i < popSize; i++) {
        const customers = _.shuffle(_.range(1, n + 1));
        const routes = Array.from({ length: numTrucks }, () => []);
        customers.forEach((customer, idx) => {
            routes[idx % numTrucks].push(customer);
        });
        population.push(routes);
    }
    return population;
}

// Evaluasi fitness
const evaluateFitness = (population, distanceMatrix, customer, truck) => {
    return population.map((individual) => {
        let totalDistance = 0;

        for (let truckIndex = 0; truckIndex < individual.length; truckIndex++) {
            const route = [...individual[truckIndex], 0]; // 0 diasumsikan sebagai depot
            let truckLoad = 0;

            for (let i = 0; i < route.length - 1; i++) {
                const fromIndex = route[i];
                const toIndex = route[i + 1];

                const volume = customer[fromIndex]?.volume_sampah ?? 0;
                truckLoad += volume;

                if (truckLoad > truck[truckIndex]) {
                    // console.log(`Truck ${truckIndex + 1} overload at customer ${fromIndex}`);
                    return 0
                };

                const distance = distanceMatrix[fromIndex]?.[toIndex];

                if (typeof distance !== "number" || isNaN(distance)) {
                    // console.log(`Invalid distance from ${fromIndex} to ${toIndex}`);
                    return 0
                };

                if (i < route.length - 2 && distance >= 5) {
                    // console.log(`Distance too long from ${fromIndex} to ${toIndex}: ${distance}`);
                    return 0
                };

                totalDistance += distance;
            }
        }
        return totalDistance === 0 ? 0 : 1 / totalDistance;
    });
};


// Rank-based selection
const rankSelection = (population, fitnessValues, numSelected) => {
    const sortedIndices = fitnessValues
        .map((val, idx) => [val, idx])
        .sort((a, b) => b[0] - a[0])
        .map(([_, idx]) => idx);

    const ranks = sortedIndices.map((_, i) => i + 1);
    const total = _.sum(ranks.map(r => population.length - r + 1));
    const selectionProb = ranks.map(r => (population.length - r + 1) / total);

    const selected = new Set();
    while (selected.size < numSelected) {
        const r = Math.random();
        let sum = 0;
        for (let i = 0; i < selectionProb.length; i++) {
            sum += selectionProb[i];
            if (r < sum) {
                selected.add(sortedIndices[i]);
                break;
            }
        }
    }

    return Array.from(selected).map(i => population[i]);
}

// Crossover
const joinRoute = (parent) => {
    return parent.flat();
}

const splitRoute = (child, sizes) => {
    const result = [];
    let start = 0;
    for (const size of sizes) {
        result.push(child.slice(start, start + size));
        start += size;
    }
    return result;
}

const crossover = (p1, p2, crossoverRate) => {
    if (Math.random() > crossoverRate) return [p1, p2];
    const parent1 = joinRoute(p1);
    const parent2 = joinRoute(p2);
    const point = _.random(1, parent1.length - 1);

    const child1 = parent1.slice(0, point).concat(parent2.filter(x => !parent1.slice(0, point).includes(x)));
    const child2 = parent2.slice(0, point).concat(parent1.filter(x => !parent2.slice(0, point).includes(x)));

    return [splitRoute(child1, p1.map(r => r.length)), splitRoute(child2, p2.map(r => r.length))];
}

// Mutasi
const mutate = (chromosome, mutationRate) => {
    if (Math.random() < mutationRate) {
        const i = _.random(0, chromosome.length - 1);
        const j = _.random(0, chromosome.length - 1);
        [chromosome[i], chromosome[j]] = [chromosome[j], chromosome[i]];
    }
    return chromosome;
}

// Hapus duplikat populasi
const removeDuplicates = (population) => {
    const seen = new Set();
    return population.filter(ind => {
        const key = JSON.stringify(ind);
        if (!seen.has(key)) {
            seen.add(key);
            return true;
        }
        return false;
    });
}

// Mutasi generasi
const generateMutation = (population, offspring, rate, popSize, n, numTrucks) => {
    const [p1, p2] = population;
    const [c1, c2] = offspring;

    const mutated = [
        mutate(_.cloneDeep(p1), rate),
        mutate(_.cloneDeep(p2), rate),
        mutate(_.cloneDeep(c1), rate),
        mutate(_.cloneDeep(c2), rate)
    ];

    let newGen = [...population, ...offspring, ...mutated];
    newGen = removeDuplicates(newGen);

    const additional = generateInitialPopulation(popSize - newGen.length, n, numTrucks);
    return [...newGen, ...additional];
}

module.exports = {
    generateInitialPopulation,
    evaluateFitness,
    rankSelection,
    crossover,
    mutate,
    generateMutation
}
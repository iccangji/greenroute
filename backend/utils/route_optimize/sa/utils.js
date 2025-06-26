const getNeighbor = (solution) => {
    const idx1 = Math.floor(Math.random() * solution.length);
    let idx2;
    do {
        idx2 = Math.floor(Math.random() * solution.length);
    } while (idx2 === idx1);

    // Deep clone karena kita akan swap child route dalam satu truk
    const newSolution = JSON.parse(JSON.stringify(solution));

    // Swap dua lokasi pada truk acak
    const truckIndex = Math.floor(Math.random() * newSolution.length);
    const route = newSolution[truckIndex];

    if (route.length > 1) {
        const i1 = Math.floor(Math.random() * route.length);
        let i2;
        do {
            i2 = Math.floor(Math.random() * route.length);
        } while (i1 === i2);

        const temp = route[i1];
        route[i1] = route[i2];
        route[i2] = temp;
    }

    return newSolution;
};

const acceptanceProbability = (currentEnergy, newEnergy, temperature) => {
    if (newEnergy > currentEnergy) return 1.0;
    return Math.exp((newEnergy - currentEnergy) / temperature);
};


module.exports = {
    getNeighbor,
    acceptanceProbability
};
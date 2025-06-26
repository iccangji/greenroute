// __tests__/optimize.test.js
const { generateMockTps, generateMockTpa } = require('./mockData');

// MOCK MODEL
jest.mock('../models', () => ({
    Tps: { findAll: jest.fn() },
    Tpa: { findByPk: jest.fn() }
}));

const { Tps, Tpa } = require('../models');
const GA = require('../utils/route_optimize/ga/genetic_algorithm');
const SA = require('../utils/route_optimize/sa/simulated_annealing');
const clustering = require('../utils/route_optimize/clustering/clustering');
const optimizer = require('../utils/route_optimize/optimize');


// TESTING
beforeEach(() => {
    const mockTps = generateMockTps(10); // pastikan generateMockTps sesuai
    const mockTpa = generateMockTpa();

    Tps.findAll.mockResolvedValue(mockTps);
    Tpa.findByPk.mockResolvedValue(mockTpa);

    // Mock Function ClusterData untuk menghasilkan data 0 klaster
    jest
        .spyOn(clustering, 'clusterData')
        .mockImplementation(() => ({
            optimalK: 0,
            dataPerCluster: []
        }));
});

test("Jalur 1", async () => {
    const GAspy = jest.spyOn(GA, 'geneticAlgorithm');
    const SAspy = jest.spyOn(SA, 'simulatedAnnealingMutation');

    const params = {
        pop_size: 10,
        max_gen: 1000,
        crossover_rate: 0.6,
        mutation_rate: 0.6,
        initial_temp: 1000,
        stop_temp: 900,
        cooling_rate: 0.3
    };

    const tps = await Tps.findAll();
    const tpa = await Tpa.findByPk(1);

    const result = optimizer.optimizeRoute(tps, tpa, params, false);

    // CEK PEMANGGILAN FUNCTION
    expect(GAspy).toHaveBeenCalledTimes(0); // Diharapkan jumlah pemanggilan = 0
    expect(SAspy).toHaveBeenCalledTimes(0); // Diharapkan jumlah pemanggilan = 0
    expect(result.rute.length).toEqual(0); // Diharapkan hasil rute berjumlah 0

    GAspy.mockRestore();
    SAspy.mockRestore();
});
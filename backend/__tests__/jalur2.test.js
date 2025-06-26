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
const GAutils = require('../utils/route_optimize/ga/utils');
const SAutils = require('../utils/route_optimize/sa/utils');
const clustering = require('../utils/route_optimize/clustering/clustering');
const optimizer = require('../utils/route_optimize/optimize');


// TESTING
beforeEach(() => {
    const mockTps = generateMockTps(10); // pastikan generateMockTps sesuai
    const mockTpa = generateMockTpa();

    Tps.findAll.mockResolvedValue(mockTps);
    Tpa.findByPk.mockResolvedValue(mockTpa);

    // Mock Function ClusterData untuk menghasilkan data 1 klaster
    jest
        .spyOn(clustering, 'clusterData')
        .mockImplementation(() => ({
            optimalK: 1,
            dataPerCluster: [
                mockTps.map(tp => ({ data: tp.data, cluster: 0 }))
            ]
        }));
});

test("Jalur 2", async () => {
    const gaSpy = jest.spyOn(GA, 'geneticAlgorithm');
    const saSpy = jest.spyOn(SA, 'simulatedAnnealingMutation');
    const mutationSpy = jest.spyOn(GAutils, 'generateMutation');
    const crossoverSpy = jest.spyOn(GAutils, 'crossover');
    const getNeighborSpy = jest.spyOn(SAutils, 'getNeighbor');

    const params = {
        pop_size: 10,
        max_gen: 1,
        crossover_rate: 0.6,
        mutation_rate: 0.6,
        initial_temp: 1000,
        stop_temp: 300,
        cooling_rate: 0.3
    };

    const tps = await Tps.findAll();
    const tpa = await Tpa.findByPk(1);

    const result = optimizer.optimizeRoute(tps, tpa, params, false);

    expect(gaSpy).toHaveBeenCalled();
    expect(saSpy).toHaveBeenCalled();
    expect(mutationSpy).toHaveBeenCalledTimes(1);
    expect(crossoverSpy).toHaveBeenCalledTimes(1);
    expect(getNeighborSpy).toHaveBeenCalledTimes(1);
    expect(result.rute.length).toBeGreaterThan(0);

    gaSpy.mockRestore();
    saSpy.mockRestore();
    mutationSpy.mockRestore();
    crossoverSpy.mockRestore();
    getNeighborSpy.mockRestore();
});

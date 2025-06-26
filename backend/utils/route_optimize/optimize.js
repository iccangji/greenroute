const clustering = require('./clustering/clustering');
const GA = require('./ga/genetic_algorithm');
const { generateInitialPopulation } = require('./ga/utils');
const { generateDistanceMatrix, estimateDistanceCapacity } = require('./utils');
const SA = require('./sa/simulated_annealing');
const { logger } = require('../logger');

function gasa_optimizer(
    customer, truck, pop_size, max_gen, crossover_rate, mutation_rate, initial_temp, stop_temp, cooling_rate
) {
    const n = customer.length - 1; // Jumlah customer (tanpa TPA)
    const numTrucks = truck.length; // Jumlah truk
    // Buat populasi awal dan matriks jarak
    const initialPopulation = generateInitialPopulation(pop_size, n, numTrucks);
    const distanceMatrix = generateDistanceMatrix(customer);

    // Melakukan algoritma genetika
    const { bestChromosome, _bestFitness } = GA.geneticAlgorithm(
        initialPopulation,
        max_gen,
        crossover_rate,
        mutation_rate,
        distanceMatrix,
        pop_size,
        customer,
        truck
    );

    // Simulated Annealing untuk penyempurnaan solusi
    const finalSolution = SA.simulatedAnnealingMutation(
        bestChromosome,
        initial_temp,
        cooling_rate,
        stop_temp,
        distanceMatrix,
        initialPopulation,
        max_gen,
        crossover_rate,
        mutation_rate,
        pop_size,
        customer,
        truck
    );


    // Ambil solusi terbaik
    const maxElement = finalSolution.reduce((max, curr) => curr[1] > max[1] ? curr : max, finalSolution[0]);

    return {
        bestChromosome: maxElement[0],
        bestFitness: maxElement[1],
        distanceMatrix: distanceMatrix
    };
}


function optimizeRoute(tps, tpa, req, isProduction) {
    logger.info('Clustering data...');
    const { optimalK, dataPerCluster } = clustering.clusterData(tps)
    logger.info(`Total klaster: ${optimalK}`);
    // console.log(dataPerCluster);

    const allRoute = [];
    let compactor_avail = 2;
    let totalTruck = 0;
    const fitnesses = [];
    let result;

    for (let i = 0; i < optimalK; i++) {
        const cluster = dataPerCluster[i]; // nanti di-loop untuk semua cluster

        if (cluster.length == 0) {
            break
        }

        logger.info(`Optimasi rute klaster ${i + 1}...`);

        // Format data untuk customer
        const customer = cluster.map(cluster => ({
            lokasi: cluster.data.tps,
            latitude: cluster.data.latitude,
            longitude: cluster.data.longitude,
            volume_sampah: cluster.data.volume_sampah
        }))
        customer.unshift({ // Tambah TPA sebagai titik awal
            lokasi: tpa.tpa,
            latitude: tpa.latitude,
            longitude: tpa.longitude,
            volume_sampah: 0,
        });

        // Hitung total permintaan sampah dan kapasitas truk
        const totalDemand = customer.reduce((sum, row) => {
            const demand = Number(row.volume_sampah);
            return sum + (isNaN(demand) ? 0 : demand);
        }, 0);
        const truckCapacity = 3;
        const truckReq = Math.ceil(totalDemand / truckCapacity);
        const truck = Array(truckReq).fill(truckCapacity);
        result = gasa_optimizer(
            customer, truck, req.pop_size, req.max_gen, req.crossover_rate, req.mutation_rate, req.initial_temp, req.stop_temp, req.cooling_rate
        );

        while (isProduction) {
            result = gasa_optimizer(
                customer, truck, req.pop_size, req.max_gen, req.crossover_rate, req.mutation_rate, req.initial_temp, req.stop_temp, req.cooling_rate
            );
            if (result.bestFitness > 0) {
                totalTruck += truck.length
                break; // Keluar dari loop jika solusi valid ditemukan
            } else {
                if (compactor_avail > 0) {
                    truck.unshift(5)
                    compactor_avail -= 1
                }
                else { truck.unshift(3, 3) }
            }
        }

        result.bestChromosome.forEach((route, index) => {
            const { totalDistance, totalLoad } = estimateDistanceCapacity(route, result.distanceMatrix, customer);

            const routeNames = route.map(index => customer[index].lokasi);
            const routeLoc = route.map(index => `${customer[index].latitude}, ${customer[index].longitude}`);

            allRoute.push({
                cluster: i + 1,
                route: {
                    armada: truck[index] === 3 ? "Dump Truck/Arm Roll" : "Compactor",
                    names: routeNames,
                    loc: routeLoc,
                    distance: totalDistance,
                    load: totalLoad,
                },
                total_truck: totalTruck,
            });
        });
        fitnesses.push(result.bestFitness);
    }

    const routes = allRoute.flatMap(route => route.route);
    const total = routes.reduce(
        (acc, item) => {
            acc.distance += item.distance;
            acc.load += item.load;
            return acc;
        },
        { distance: 0, load: 0 }
    );

    const avgDistance = total.distance / routes.length;
    const avgLoad = total.load / routes.length;

    logger.info(`Optimasi rute selesai!`);

    return {
        klaster: optimalK,
        fitnesses: fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length,
        total_truk: totalTruck,
        avg_distance: avgDistance.toFixed(2),
        avg_load: avgLoad.toFixed(2),
        rute: routes
    };
}

module.exports = {
    optimizeRoute
};
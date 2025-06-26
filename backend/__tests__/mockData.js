const generateMockTps = (numTps = 30) => {
    const tpsList = [];

    for (let i = 0; i < numTps; i++) {
        tpsList.push({
            data: {
                id: i + 1,
                tps: `Tps ${i + 1}`,
                latitude: -4.0 + Math.random() * 0.05,     // sekitar -4.0
                longitude: 122.5 + Math.random() * 0.05,    // sekitar 122.5
                volume_sampah: parseFloat((Math.random() * 2 + 0.5).toFixed(2)), // 0.5 - 2.5 ton
            }
        });
    }

    return tpsList;
}

const generateMockTpa = () => {
    return {
        id: 1,
        tpa: 'TPA',
        latitude: -4.0 + Math.random() * 0.05,     // sekitar -4.0
        longitude: 122.5 + Math.random() * 0.05,    // sekitar 122.5
    }
}

module.exports = {
    generateMockTps,
    generateMockTpa
};
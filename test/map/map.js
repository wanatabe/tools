MapUtil.init('map', '3262f734de66c1e7d8f9beaed5886ea3', '2.0').then(instance => {
    instance.addControl()
    instance.drawHospital()
    instance.drawPatient([106.520719, 29.569032])
    instance.drawCar({
        targetGps: '106.520719,29.569032',
        status: 6,
        licensePlate: 'ceshi',
        longitude: 106.53119,
        latitude: 29.560074
    })
    console.log(instance);
    // instance.setMapCenter()
})


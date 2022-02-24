MapUtil.init('map', '18ec15f4ee875ef1dac8f8e6b33dee11', '2.0').then(instance => {
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


const CitySelector = require('./CitySelector');

/* Пример создания компонента: */

let citySelector;

$('#createCitySelector').click(() => {
    citySelector = new CitySelector({
        elementId: 'citySelector',
        regionsUrl: 'http://localhost:3000/regions',
        localitiesUrl: 'http://localhost:3000/localities',
        saveUrl: 'http://localhost:3000/selectedRegions',
        $infoElement: $('#info')
    });
});

$('#destroyCitySelector').click(() => {
    citySelector.destroy();
    citySelector = null;
});


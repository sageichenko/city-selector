require('./style.less');

// Your code...
class CitySelector {
    constructor({elementId, regionsUrl, localitiesUrl, saveUrl, $infoElement}) {
        this._element = $(`#${elementId}`);
        this._regionsURL = regionsUrl;
        this._localitiesURL = localitiesUrl;
        this._saveURL = saveUrl;
        this._infoRegion = $infoElement.find('#regionText');
        this._infoLocal = $infoElement.find('#localityText');

        this._localities = {};

        this._selectedRegionId = null;
        this._selectedLocalName = null;

        this._element.html(this.render());
        this.initEvents();
    }

    render() {
        if (!this._html) {
            this._html = `
    <button class="select-btn">Выбрать регион</button>
    <form action="#">
        <select name="regions" class="select-regions"></select>
        <select name="localities" class="select-localities"></select>
        <button class="save-btn">Сохранить</button>
    </form>
        `
        }
        return this._html;
    }

    initEvents() {
        this._element.click( (ev) => {
            const target = ev.target;
            if (target.classList.contains('select-btn')) {
                this.getRegions();
                return;
            }

            if (target.classList.contains('select-regions__item')) {
                this._selectedRegionId = target.dataset.idRegion;
                this.getLocalities(this._selectedRegionId);
                this._infoRegion.html(this._selectedRegionId);
                this._infoLocal.html('');
                return;
            }

            if (target.classList.contains('select-localities__item')) {
                this._selectedLocalName = target.dataset.localName;
                this._infoLocal.html(this._selectedLocalName);
                return;
            }

            if (target.classList.contains('save-btn')) {
                this.saveData();
                return;
            }
        });
    }

    getRegions() {
        if (this._regions === undefined) {
            $.ajax({
                url: this._regionsURL,
                success: (data) => {
                    this._regions = data;
                    this.showRegions();
                },
                error: () => {
                    alert('Sorry, some thing is wrong :(');
                }
            });
        } else {
            this.showRegions();
        }

    }

    showRegions () {
        const $selectRegions = this._element.find('.select-regions');

        $selectRegions.attr('size', this._regions.length);

        this._regions.forEach((item) => {
            $selectRegions.append(`<option class="select-regions__item" data-id-region="${item.id}">${item.title}</option>`);
        });
    }

    getLocalities(regionId) {
        if (this._localities[regionId] === undefined) {
            $.ajax({
                url: `${this._localitiesURL}/${regionId}`,
                success: (data) => {
                    this._localities[regionId] = data.list;

                    this.showLocalities(regionId);
                },
                error: () => {
                    alert('Sorry, some thing is wrong :(');
                }
            });
        } else {
            this.showLocalities(regionId);
        }
    }

    showLocalities (regionId) {
        const $selectLocalities = this._element.find('.select-localities');

        $selectLocalities.attr('size', this._localities[regionId].length);


        this._localities[regionId].forEach((item) => {
            $selectLocalities.append(`<option class="select-localities__item" data-local-name="${item}">${item}</option>`);
        });
    }

    saveData () {
        $.ajax({
            type: 'POST',
            url: this._saveURL,
            data: {
                regionId: this._selectedRegionId,
                localityName: this._selectedLocalName
            },
            success: () => {
                alert('success');
            },
            error: () => {
                alert('Sorry, some thing is wrong :(');
            },
            async: false
        });
    }
}

module.exports = CitySelector;

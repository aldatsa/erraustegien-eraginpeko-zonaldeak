var Erraustegia = function(mapa, izena, koordenatuak, zirkuluak) {
    "use strict";

    var self = this;

    this.zoom_muga = 10;

    this.mapa = mapa;

    this.izena = izena;
    this.koordenatuak = koordenatuak;
    this.zirkuluak = zirkuluak;

    this.leaflet_zirkuluak = [];
    this.etiketak = [];

    this.mapa.on('zoomend', function() {

        // Zirkuluak txikiak direnean etiketak ezkutatu, bestela elkarren gainean ikusten dira.
        if (self.mapa.getZoom() < self.zoom_muga) {

            if (self.etiketakIkusgai()) {

                self.ezabatuEtiketak();

            }
        } else {

            if (self.zirkuluakIkusgai() && !self.etiketakIkusgai()) {

                self.gehituEtiketak();

            }
        }
    });
};

Erraustegia.prototype.marraztuZirkuluak = function() {

    var self = this;

    self.zirkuluak.forEach(function(element, index, array) {

        self.leaflet_zirkuluak.push(L.circle(self.koordenatuak, element.distantzia, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: element.opakotasuna
        }).addTo(self.mapa));

    });

};

Erraustegia.prototype.gehituEtiketak = function() {

    var self = this;

    if (self.mapa.getZoom() >= self.zoom_muga) {

        self.zirkuluak.forEach(function(element, index, array) {

            self.gehituEtiketa(self.leaflet_zirkuluak[index].getBounds().getNorth(), self.leaflet_zirkuluak[index].getBounds().getCenter().lng, element.distantzia);

        });
    }
};

Erraustegia.prototype.gehituEtiketa = function(lat, lng, distantzia) {

    var etiketa = new L.Label();

    etiketa.setContent(distantzia / 1000 + " km");
    etiketa.setLatLng([lat, lng]);

    this.mapa.showLabel(etiketa);
    this.etiketak.push(etiketa);

};

Erraustegia.prototype.ezabatuZirkuluak = function() {

    var self = this;

    self.leaflet_zirkuluak.forEach(function(element, index, array) {

        self.mapa.removeLayer(element);

    });

    self.leaflet_zirkuluak = [];

};
Erraustegia.prototype.ezabatuEtiketak = function () {

    var self = this;

    self.etiketak.forEach(function(element, index, array) {

        self.mapa.removeLayer(element);

    });

    self.etiketak = [];

};

Erraustegia.prototype.zirkuluakIkusgai = function () {

    return this.leaflet_zirkuluak.length > 0;

};

Erraustegia.prototype.etiketakIkusgai = function () {

    return this.etiketak.length > 0;

};

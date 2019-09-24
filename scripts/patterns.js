class Pattern {
    constructor() {
        this.id = -1;
        this.name = "";
        this.oilPerBoard = "";
        this.forward = [];
        this.reverse = [];
    }

    static buildPatternFromDoc(data) {
        let pattern = new Pattern();
        pattern.id = data.id;
        pattern.name = data.name;
        pattern.oilPerBoard = data.oilPerBoard;
        pattern.forward = JSON.parse(data.forward);
        pattern.reverse = JSON.parse(data.reverse);
        return pattern;
    }

    static playersHouseShot() {
        return {
            "name": "Players House Shot",
            "oilPerBoard": "38 uL",
            "forward": [
                { "start": "2", "stop": "2", "loads": "2", "speed": "10", "startf": "0.0", "end": "1.0" },
                { "start": "8", "stop": "8", "loads": "1", "speed": "14", "startf": "1.0", "end": "3.0" },
                { "start": "8", "stop": "8", "loads": "1", "speed": "14", "startf": "3.0", "end": "5.0" },
                { "start": "9", "stop": "9", "loads": "2", "speed": "18", "startf": "5.0", "end": "10.0" },
                { "start": "10", "stop": "10", "loads": "3", "speed": "18", "startf": "10.0", "end": "17.0" },
                { "start": "11", "stop": "11", "loads": "1", "speed": "18", "startf": "17.0", "end": "20.0" },
                { "start": "12", "stop": "12", "loads": "1", "speed": "18", "startf": "20.0", "end": "22.0" },
                { "start": "13", "stop": "13", "loads": "1", "speed": "18", "startf": "22.0", "end": "25.0" },
                { "start": "2", "stop": "2", "loads": "0", "speed": "22", "startf": "25.0", "end": "41.0" }
            ],
            "reverse": [
                { "start": "2", "stop": "2", "loads": "0", "speed": "30", "startf": "41.0", "end": "33.0" },
                { "start": "12", "stop": "12", "loads": "1", "speed": "18", "startf": "33.0", "end": "30.0" },
                { "start": "11", "stop": "11", "loads": "2", "speed": "18", "startf": "30.0", "end": "25.0" },
                { "start": "10", "stop": "10", "loads": "1", "speed": "18", "startf": "25.0", "end": "22.0" },
                { "start": "10", "stop": "10", "loads": "4", "speed": "14", "startf": "22.0", "end": "15.0" },
                { "start": "9", "stop": "9", "loads": "2", "speed": "14", "startf": "15.0", "end": "11.0" },
                { "start": "8", "stop": "8", "loads": "2", "speed": "10", "startf": "11.0", "end": "8.0" },
                { "start": "8", "stop": "8", "loads": "1", "speed": "10", "startf": "8.0", "end": "6.0" },
                { "start": "8", "stop": "8", "loads": "0", "speed": "10", "startf": "6.0", "end": "0.0" }
            ]
        };
    }

    static usOpen() {
        return {
            "name": "US Open 40ft 2012",
            "oilPerBoard": "40 uL",
            "forward":
                [{ "start": "2", "stop": "2", "loads": "4", "speed": "14", "startf": "0.0", "end": "5.9" },
                { "start": "2", "stop": "2", "loads": "3", "speed": "18", "startf": "5.9", "end": "13.5" },
                { "start": "2", "stop": "2", "loads": "3", "speed": "18", "startf": "13.5", "end": "21.1" },
                { "start": "2", "stop": "2", "loads": "2", "speed": "18", "startf": "21.1", "end": "26.2" },
                { "start": "4", "stop": "4", "loads": "2", "speed": "22", "startf": "26.2", "end": "32.4" },
                { "start": "4", "stop": "4", "loads": "1", "speed": "26", "startf": "32.4", "end": "36.0" },
                { "start": "2", "stop": "2", "loads": "0", "speed": "26", "startf": "36", "end": "40.0" }],
            "reverse": [{ "start": "2", "stop": "2", "loads": "0", "speed": "26", "startf": "40.0", "end": "28.0" },
            { "start": "3", "stop": "3", "loads": "2", "speed": "22", "startf": "28.0", "end": "21.8" },
            { "start": "3", "stop": "3", "loads": "2", "speed": "22", "startf": "21.8", "end": "15.6" },
            { "start": "2", "stop": "2", "loads": "0", "speed": "18", "startf": "15.6", "end": "0.0" }]
        };
    }
}

module.exports = Pattern;
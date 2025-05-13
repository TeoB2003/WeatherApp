export interface WeatherData{
    maxTemperatureToday:number,
    minTemperatureToday: number,
    maxPrecipitationProbabilityToday:{
        prob: number,
        hour:number
    },

    visibilityNow:number,
    UVIndex:number,
    apparentTemperature:number,
    precipitation: {
        snowfall:number,
        rain: number,
        showers:number
    },
    precipitationNow: number
}
export interface WeatherData{
    maxTemperatureToday:number,
    minTemperatureToday: number,
    maxPrecipitationProbabilityToday:{
        prob: number,
        hour:number
    },
    visibilityNow:number,
    UVIndex:number,
    apparentTemperature:number
}
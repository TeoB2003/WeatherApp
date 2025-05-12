import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card'; 
import { WeatherData } from '../shared/model/weatherData';
@Component({
  selector: 'app-precipitations',
  imports: [CardModule],
  templateUrl: './precipitations.component.html',
  styleUrl: './precipitations.component.scss'
})
export class PrecipitationsComponent {
  precipitations= input<WeatherData["precipitation"]>()

  getinfo()
  {
    if(this.precipitations()!.rain>0)
    {
      return "Rain 🌧️"
    }
    else if( this.precipitations()!.showers>0)
    {
      return "Shower 🌦️ "
    }
    else if (this.precipitations()!.snowfall>0)
    {
      return "Snowfall 🌨️"
    }
    else {
      return "No precipitations now"
    }
  }
}

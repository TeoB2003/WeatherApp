import { Component, output } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  imports: [],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  username="Eu"
  close=output()
  emitClose()
  {
    this.close.emit()
  }

  goToLogin()
  {
    console.log("Plec")
  }

  logout()
  {
    console.log("Ies")
  }
}

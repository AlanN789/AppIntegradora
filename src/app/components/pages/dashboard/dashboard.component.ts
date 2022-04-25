import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/Services/Auth/auth.service';
import { errorMessage, successDialog, timeMessage } from 'src/app/functions/alerts';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SensoresService } from 'src/app/Services/Services/Sensores/sensores.service';
import Chart from 'chart.js/auto';
import { interval, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AgregarComponent } from '../agregar/agregar.component';
import { ConfigComponent } from '../config/config.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  addSensorDialogRef!: MatDialogRef < AgregarComponent > ;
  editSensorDialogRef!: MatDialogRef < ConfigComponent > ;
  subscription!:Subscription
  datosSensor:any
  Sensor:any = []
  Valores:any = []
  Fechas:any
  Sensores:any = []
  Chart:any
  Id:any
  mostrarChart:boolean
  Tipos:any = [
    {
      id:'US',
      nombre:'Ultrasonico'
    },
    {
      id:'TEMP',
      nombre:'Temperatura'
    },
    {
      id:'GAS',
      nombre:'Gas'
    },
    {
      id:'PIR',
      nombre:'Movimiento'
    }
  ]

  constructor(private authService:AuthService, private cookie:CookieService, private router:Router, private sensoresService:SensoresService, private dialog:MatDialog) {
    this.mostrarChart = false
    const contador = interval(3000)
    contador.subscribe(()=>{
      if(this.Chart){
        this.updateDatos();
      }
    })
  }

  ngOnInit(): void {
    this.getSensores();

    this.subscription = this.sensoresService.refresh$.subscribe(()=>{
      this.getSensores();
      this.getSensor();
    })
  }

  logout():void{
    this.authService.logout().subscribe((data:any)=>{
      timeMessage('Saliendo...',1500).then(() => {
        this.cookie.delete('token');
        successDialog('Logout Completado');
        this.router.navigate(['/login']);
      })
    }, error => {
      errorMessage('Ha ocurrido un error')
    });
  }

  getSensores():void{
    this.sensoresService.verSensores().subscribe((data:any)=>{
      if (data.length != this.Sensores.length){
        this.Sensores = data
        this.mostrarChart = false
        this.Id = null
      }
      console.log(this.Sensores)
    })
  }

  getSensor():void{
    if (this.Id){
      this.sensoresService.getSensor(this.Id).subscribe((data:any)=>{
        this.datosSensor = data[0]
        console.log(this.datosSensor)
      })
    }
  }

  mostrarDatos(id:number):void{
    this.mostrarChart = true
    this.Id = id
    this.getSensor()
    this.sensoresService.getValores(id).subscribe((data:any)=>{
      this.Sensor = data
      this.Fechas = []
      this.Valores = []
      for (let i = 0; i < this.Sensor.length; i++){
        this.Fechas.push(this.Sensor[i].created_at);
        this.Valores.push(this.Sensor[i].valor);
      }
      if (this.Chart){
        this.Chart.destroy();
      }
      this.Chart = new Chart('canvas',{
        type:'line',
        data:{
          labels: this.Fechas,
          datasets:[
            {
              label: 'Medida',
              data: this.Valores,
              borderWidth: 3,
              fill: false,
              backgroundColor: 'rgba(93,175,89,0.1)',
              borderColor: 'rgb(103, 58, 183)',
              tension:0.1
            }
          ]
        }
      })
    })
  }

  updateDatos():void{
    this.sensoresService.getValores(this.Id).subscribe((data:any)=>{

      if (data.length > this.Sensor.length){
        this.Sensor = data
        this.Fechas.push(data[data.length - 1].created_at)
        this.Valores.push(data[data.length - 1].valor)
      }
    })
    this.Chart.update();
  }

  motores():void{
    this.sensoresService.motores().subscribe()
  }

  onCreateAgr():void{
    this.dialog.open(AgregarComponent);
  }

  onCreateConf():void{
    console.log(this.datosSensor)
    if (this.datosSensor){
      this.cookie.set('configID', this.Id)
      this.cookie.set('claveID', this.datosSensor.clave)
      this.cookie.set('tipoID', this.datosSensor.tipo)
      this.cookie.set('triggerID', this.datosSensor.pin[0].trigger)
      if (this.datosSensor.tipo == 'US'){
        this.cookie.set('echoID', this.datosSensor.pin[0].echo)
      }
      else{
        this.cookie.delete('echoID')
      }
      console.log(this.cookie.get('configID'))
      console.log(this.cookie.get('echoID'))
    }
    else{
      this.cookie.delete('configID')
    }
    this.dialog.open(ConfigComponent);
  }
  displayedColumns: string[] = ['Valor', 'Fecha'];

}

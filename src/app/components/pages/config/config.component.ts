import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { SensorEdit } from 'src/app/Interfaces/Sensor/sensor-edit';
import { SensorEditSec } from 'src/app/Interfaces/Sensor/sensor-edit-sec';
import { SensoresService } from 'src/app/Services/Services/Sensores/sensores.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  Sensor:any
  configForm!: FormGroup;
  guardarSensorSec!: SensorEditSec;
  guardarSensor!: SensorEdit;
  mostrarTrigger!: boolean;
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
    },
    {
      id:'HUM',
      nombre:'Humedad'
    }
  ]

  constructor(private sensoresService:SensoresService, private fb:FormBuilder, private cookieService:CookieService, public dialogRef: MatDialogRef <ConfigComponent>) {
    this.disabledtrigger()
    if (this.cookieService.check('configID')){
      this.createFormDatos();
    }
    else{
      this.createForm();
    }
   }

  ngOnInit(): void {

  }

  delete():void{
    this.sensoresService.delete(this.cookieService.get('configID')).subscribe((data:any)=>{
      console.log("Se borro correctamente")
    });
    this.dialogRef.close();
  }

  edit():void{
    if(this.configForm.invalid){
      return Object.values(this.configForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    else{
      this.setSensor();
      if(this.configForm.get('tipo')?.value == 'US'){
        this.sensoresService.edit(this.guardarSensorSec).subscribe((data:any)=>{
          console.log("Se edito correctamente")
        })
      }
      else{
        this.sensoresService.edit(this.guardarSensor).subscribe((data:any)=>{
          console.log("Se edito correctamente")
        })
      }
      this.configForm.reset();
      this.dialogRef.close();
    }
  }
  setSensor():void{
    if (this.configForm.get('tipo')?.value == 'US'){
      this.guardarSensorSec = {
        id: parseInt(this.cookieService.get('configID')),
        clave: this.configForm.get('clave')?.value,
        tipo: this.configForm.get('tipo')?.value,
        trigger: this.configForm.get('trigger')?.value,
        echo: this.configForm.get('echo')?.value
      }
    }
    else{
      this.guardarSensor = {
        id: parseInt(this.cookieService.get('configID')),
        clave: this.configForm.get('clave')?.value,
        tipo: this.configForm.get('tipo')?.value,
        trigger: this.configForm.get('trigger')?.value,
      }
    }
  }
  createForm(): void {
    this.configForm = this.fb.group({
      clave:[''],
      tipo: new FormControl({ value: '', disabled: true }),
      trigger:[null],
      echo:[null]
    })
  }
  createFormDatos(): void {
    console.log(this.cookieService.get('claveID'))
    console.log(this.cookieService.get('tipoID'))
    console.log(this.cookieService.get('triggerID'))
    console.log(this.cookieService.get('echoID'))
    console.log(this.cookieService.get('triggerID'))
    if(this.cookieService.check('echoID')){
      this.configForm = this.fb.group({
        clave:[this.cookieService.get('claveID')],
        tipo: new FormControl({ value: this.cookieService.get('tipoID'), disabled: true }),
        trigger:[this.cookieService.get('triggerID')],
        echo:[this.cookieService.get('echoID')]
      })
    }
    else{
      this.configForm = this.fb.group({
        clave:[this.cookieService.get('claveID')],
        tipo: new FormControl({ value: this.cookieService.get('tipoID'), disabled: true }),
        trigger:[this.cookieService.get('triggerID')],
        echo:[null]
      })
    }
  }
  disabledtrigger():void{
    this.mostrarTrigger = this.cookieService.check('echoID')
  }


}

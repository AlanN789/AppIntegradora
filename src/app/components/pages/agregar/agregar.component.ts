import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SensoresService } from 'src/app/Services/Services/Sensores/sensores.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {
  agregarForm!: FormGroup;
  guardarSensorSec: any;
  guardarSensor: any;
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

  constructor(private sensoresService:SensoresService, private fb:FormBuilder, public dialogRef: MatDialogRef <AgregarComponent>) {
    this.createForm();
   }

  ngOnInit(): void {
  }

  agregar():void{
    if(this.agregarForm.invalid){
      return Object.values(this.agregarForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    else{
      this.setSensor();
      if(this.agregarForm.get('tipo')?.value == 'US'){
        this.sensoresService.agregar(this.guardarSensorSec).subscribe((data:any)=>{
          console.log("Se agrego correctamente")
        })
      }
      else{
        this.sensoresService.agregar(this.guardarSensor).subscribe((data:any)=>{
          console.log("Se agrego correctamente")
        })
      }
      this.agregarForm.reset();
      this.dialogRef.close();
    }
  }
  setSensor():void{
    console.log(this.agregarForm.get('clave')?.value)
    if (this.agregarForm.get('tipo')?.value == 'US'){
      this.guardarSensorSec = {
        clave: this.agregarForm.get('clave')?.value,
        tipo: this.agregarForm.get('tipo')?.value,
        trigger: this.agregarForm.get('trigger')?.value,
        echo: this.agregarForm.get('echo')?.value
      }
    }
    else{
      this.guardarSensor = {
        clave: this.agregarForm.get('clave')?.value,
        tipo: this.agregarForm.get('tipo')?.value,
        trigger: this.agregarForm.get('trigger')?.value,
      }
    }
  }
  createForm(): void {
    this.agregarForm = this.fb.group({
      clave:[''],
      tipo:[''],
      trigger:[null],
      echo:[null]
    })
  }
  disabledtrigger(option:string):void{
    this.mostrarTrigger =  option == "US"
  }

}

import { AfterContentInit, Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import {Car} from './car';
import {CarService} from './carservice';
import { LazyLoadEvent } from 'primeng/api';
import {MessageService} from 'primeng/api';
import { Product } from './product';
import { ProductService } from './productservice';
import { SortEvent } from 'primeng/api';
import * as _ from 'underscore';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],

})
export class AppComponent implements OnInit{
  products1: Product[];

  products2: Product[];

  products3: Product[];
  cars: Car[];

  virtualCars: Car[];

  cols: any[];
  display: boolean = false;

  recordData: any;
  arr = [];
  res = [];
  student = [{"id":123,"name":"Test","value":{"pass": true, "verified": true}}];

  displayModal: boolean = false;
  constructor(private carService: CarService, private productService: ProductService) {}

  ngAfterContentInit(){
    
  }
  ngOnInit() {
    this.cols = [
        {field: 'vin', header: 'Vin'},
        {field: 'brand', header: 'Brand'},
        {field: 'color', header: 'Color'},
        {field: 'year', header: 'Year'}
        
        
    ];

    this.cars = Array.from({length: 10000}).map(() => this.carService.generateCar());
    this.virtualCars = Array.from({length: 10000});
}


DisplayCard(rowData){
  this.display = true;
  this.recordData =rowData;
  console.log(typeof(this.recordData));
  this.displayModal = true;
  console.log("RowData",this.recordData);
  
//   this.res = _.values(this.recordData)
  for (var x in this.recordData){
     this.res.push(this.recordData[x]);
 }
 if(this.res.length > 4){
    this.res.splice(0, 4);
 }
 

//  console.log(this.res);
//   for(let result of this.recordData){
//       this.arr.push(result);
//   }
}
loadCarsLazy(event: LazyLoadEvent) {       
    //simulate remote connection with a timeout 
    setTimeout(() => {
        //load data of required page
        let loadedCars = this.cars.slice(event.first, (event.first + event.rows));

        //populate page of virtual cars
        Array.prototype.splice.apply(this.virtualCars, [...[event.first, event.rows], ...loadedCars]);
        
        //trigger change detection
        this.virtualCars = [...this.virtualCars];
    }, Math.random() * 1000 + 250);
}

customSort(event: SortEvent) {
  event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
          result = -1;
      else if (value1 != null && value2 == null)
          result = 1;
      else if (value1 == null && value2 == null)
          result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
          result = value1.localeCompare(value2);
      else
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
  });
}
}

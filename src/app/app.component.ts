import { Component } from '@angular/core';
import {Car} from './car';
import {CarService} from './carservice';
import { LazyLoadEvent } from 'primeng/api';
import {MessageService} from 'primeng/api';
import { Product } from './product';
import { ProductService } from './productservice';
import { SortEvent } from 'primeng/api';
import { CarDetail} from './CarDetail'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
  styles: [`
        .loading-text {
            display: block;
            background-color: #f1f1f1;
            min-height: 30px;
            animation: pulse 1s infinite ease-in-out;
            text-indent: -99999px;
            overflow: hidden;
            width:100px;
            border-bottom-right-radius: 30px;
            border-top-right-radius: 30px;
        }
    `]
})
export class AppComponent {
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
  constructor(private carService: CarService, private productService: ProductService) {}
  ngOnInit() {
    this.cols = [
        {field: 'vin', header: 'Vin'},
        // {field: 'year', header: 'Year'},
        {field: 'brand', header: 'Brand'},
        {field: 'color', header: 'Color'}
    ];

    this.cars = Array.from({length: 10000}).map(() => this.carService.generateCar());
    this.virtualCars = Array.from({length: 10000});

    this.productService.getProductsSmall().then(data => this.products1 = data);
    this.productService.getProductsSmall().then(data => this.products2 = data);
    this.productService.getProductsSmall().then(data => this.products3 = data);
}


DisplayCard(rowData){
  this.display = true;
  this.recordData = JSON.parse(rowData);
  console.log("ROwData",this.recordData);
//   this.res = _.values(this.recordData)
  for (var x in this.recordData){
     this.res = this.recordData[x]
 }
 console.log(this.res);
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

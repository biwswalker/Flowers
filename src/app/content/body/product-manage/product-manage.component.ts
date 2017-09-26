import { ManageProductForm } from '../../../forms/manage-product';
import { ProductService } from '../../../services/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-manage',
  templateUrl: './product-manage.component.html',
  styleUrls: ['./product-manage.component.css']
})
export class ProductManageComponent implements OnInit {

  // FormGroup
  group: FormGroup;

  // Form
  productForm: ManageProductForm;

  // Mode
  isAddPage = false;

  // Datatables
  dtOptions: DataTables.Settings = {};

  // Image
  imagePath: any = '';
  fileList: FileList;
  binaryString: string;
  file: File;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productForm = new ManageProductForm();
    this.imagePath = './assets/img/empty.png'
    this.isAddPage = false;
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthChange: false,
      info: false,
      pageLength: 10
    };

    this.productForm.product.productSize = 'S';
    this.productForm.product.productType = 'S';

    this.group = new FormGroup({
      'name': new FormControl(this.productForm.product.productName, Validators.required),
      'category': new FormControl(this.productForm.product.productCategory, Validators.required),
      'price': new FormControl(this.productForm.product.productPrice, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])),
      'size': new FormControl(this.productForm.product.productSize, Validators.required),
      'type': new FormControl(this.productForm.product.productType, Validators.required),
      'detail': new FormControl(this.productForm.product.productDetail),
      'file': new FormControl(null),
    });
  }

  onChangePage(mode: string) {
    if (mode === 'I') {
      this.isAddPage = true;
    } else {
      this.isAddPage = false;
    }
  }

  onClickSubmit() {
    if (this.group.valid) {
      let test = { name: this.group.value.name, category: this.group.value.category, price: this.group.value.price };
      this.productService.addProduct(test)
        .then(data => { console.log('Success') })
        .catch(error => { console.log('Error : ' + error.message) });
    }
  }

  onUploadImage(event) {
    this.fileList = event.target.files;
    if (this.fileList.length > 0) {
      this.file = this.fileList[0];
      // 10 MB
      if (this.file.size < 10000000) {
        let reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(this.file);
      } else {
        this.onDeleteImage();
      }
    } else {
      this.onDeleteImage();
    }
  }

  handleReaderLoaded(readerEvent) {
    this.binaryString = readerEvent.target.result;
    this.imagePath = 'data:' + this.file.type + ';base64,' + btoa(this.binaryString);
  }

  onDeleteImage() {
    this.imagePath = './assets/img/empty.png'
    this.fileList = null;
    this.binaryString = null;
    this.file = null;
  }

}

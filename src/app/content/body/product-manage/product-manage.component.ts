import { AlertService } from '../../../services/alert.service';
import { ManageProductForm } from '../../../forms/manage-product';
import { ProductService } from '../../../services/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgProgressService } from 'ngx-progressbar';

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

  // Loading
  public loading = false;

  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    private progressService: NgProgressService,) { }

  ngOnInit() {
    this.progressService.start();
    setTimeout(()=>{
      this.progressService.done();
    }, 2000);

    this.imagePath = './assets/img/empty.png'
    this.isAddPage = false;
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthChange: false,
      info: false,
      pageLength: 10
    };
    this.resetform();
  }

  resetform() {
    this.productForm = new ManageProductForm();
    this.productForm.product.productSize = 'S';
    this.productForm.product.productType = 'S';

    this.group = new FormGroup({
      'productName': new FormControl(this.productForm.product.productName, Validators.required),
      'productCategory': new FormControl(this.productForm.product.productCategory, Validators.required),
      'productPrice': new FormControl(this.productForm.product.productPrice, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])),
      'productSize': new FormControl(this.productForm.product.productSize, Validators.required),
      'productType': new FormControl(this.productForm.product.productType, Validators.required),
      'productDetail': new FormControl(this.productForm.product.productDetail),
      'file': new FormControl(null),
    });

    this.onDeleteImage();
  }

  onChangePage(mode: string) {
    this.resetform();
    if (mode === 'I') {
      this.isAddPage = true;
    } else {
      this.isAddPage = false;
    }
  }

  onClickSubmit() {
    if (this.binaryString === null) {
      this.alertService.warn('กรุณาอัพโหลดไฟล์รูปภาพ');
    }
    // if (this.group.valid) {
    //   this.productForm.product.productName = this.group.value.productName;
    //   this.productForm.product.productCategory = this.group.value.productCategory;
    //   this.productForm.product.productPrice = this.group.value.productPrice;
    //   this.productForm.product.productSize = this.group.value.productSize;
    //   this.productForm.product.productType = this.group.value.productType;
    //   this.productForm.product.productDetail = this.group.value.productDetail;
    //   this.productService.addProduct(this.productForm, this.imagePath)
    //     .then(data => { console.log('Success'); this.onChangePage('S'); })
    //     .catch(error => { console.log('Error : ' + error.message) });
    // }
  }

  onUploadImage(event) {
    this.loading = true;
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
        this.loading = false;
      }
    } else {
      this.onDeleteImage();
      this.loading = false;
    }
  }

  handleReaderLoaded(readerEvent) {
    this.binaryString = readerEvent.target.result;
    this.imagePath = 'data:' + this.file.type + ';base64,' + btoa(this.binaryString);
    this.loading = false;
  }

  onDeleteImage() {
    this.progressService.done();
    this.imagePath = './assets/img/empty.png'
    this.fileList = null;
    this.binaryString = null;
    this.file = null;
  }
}

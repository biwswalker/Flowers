import { AlertService } from '../../../services/alert.service';
import { ManageProductForm } from '../../../forms/manage-product';
import { ProductService } from '../../../services/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgProgressService } from 'ngx-progressbar';
import { Product } from "../../../models/product";

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
  productListForm: ManageProductForm[] = [];

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
  loadingImage = false;
  loading = false;

  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    private progressService: NgProgressService) { }

  ngOnInit() {
    this.loading = true;
    this.productService.fetchProductListData()
      .then((products: Product[]) => {
        this.productListForm = [];
        let form: ManageProductForm;
        products.forEach(product => {
          form = new ManageProductForm();
          form.product = product
          this.productListForm.push(form);
        });
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.alertService.error('เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ')
        setTimeout(() => {
          this.alertService.clear();
        }, 5000);
      });
    this.imagePath = './assets/img/empty.png'
    this.isAddPage = false;
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthChange: false,
      info: false,
      pageLength: 10
    };
  }

  resetFormGroup() {
    this.group = new FormGroup({
      'productName': new FormControl(this.productForm.product.productName, Validators.required),
      'productCategory': new FormControl(this.productForm.product.productCategory, Validators.required),
      'productPrice': new FormControl(this.productForm.product.productPrice, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])),
      'productSize': new FormControl(this.productForm.product.productSize, Validators.required),
      'productType': new FormControl(this.productForm.product.productType, Validators.required),
      'productDetail': new FormControl(this.productForm.product.productDetail),
      'file': new FormControl(null),
    });
  }

  onChangePage(mode: string) {
    if (mode === 'I') {
      this.isAddPage = true;
      this.productForm = new ManageProductForm();
      this.productForm.product.productSize = 'S';
      this.productForm.product.productType = 'S';
      this.resetFormGroup();
      this.onDeleteImage();
    } else if (mode === 'U') {
      this.isAddPage = true;
      this.resetFormGroup();
    } else {
      this.getAllDataProduct();
      this.isAddPage = false;
    }
  }

  onClickSubmit() {
    if (!this.binaryString) {
      this.alertService.warn('กรุณาอัพโหลดไฟล์รูปภาพ')
      setTimeout(() => {
        this.alertService.clear();
      }, 5000);
      return;
    }
    this.progressService.start();
    this.loading = true;
    if (this.group.valid) {
      this.productForm.product.productName = this.group.value.productName;
      this.productForm.product.productCategory = this.group.value.productCategory;
      this.productForm.product.productPrice = this.group.value.productPrice;
      this.productForm.product.productSize = this.group.value.productSize;
      this.productForm.product.productType = this.group.value.productType;
      this.productForm.product.productDetail = this.group.value.productDetail;
      this.productService.addProduct(this.productForm, this.imagePath)
        .then(data => {
          console.log('Success');
          this.progressService.done();
          this.loading = false;
          this.onChangePage('S');
          this.alertService.success('บันทึกสินค้าเรียบร้อย')
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          return;
        })
        .catch(error => {
          console.log('Error : ' + error.message)
        });
    }
  }

  onClickUpload() {
    this.loadingImage = true;
  }

  onUploadImage(event) {
    this.fileList = event.target.files;
    if (this.fileList.length > 0) {
      this.loadingImage = false;
      this.file = this.fileList[0];
      // 5 MB
      if (this.file.size < 5000000) {
        let reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(this.file);
      } else {
        this.onDeleteImage();
        this.loadingImage = false;
      }
    } else {
      this.onDeleteImage();
      this.loadingImage = false;
    }
  }

  handleReaderLoaded(readerEvent) {
    this.binaryString = readerEvent.target.result;
    this.imagePath = 'data:' + this.file.type + ';base64,' + btoa(this.binaryString);
    this.loadingImage = false;
  }

  onDeleteImage() {
    this.progressService.done();
    this.imagePath = './assets/img/empty.png'
    this.fileList = null;
    this.binaryString = null;
    this.file = null;
  }

  getAllDataProduct() {
    this.loading = true;
    this.productListForm = [];
    let form: ManageProductForm;
    this.productService.getProductList().forEach(product => {
      form = new ManageProductForm();
      form.product = product
      this.productListForm.push(form);
    });
    this.loading = false;
  }

  onSelectRow(form: ManageProductForm) {
    this.productForm = form;
    this.imagePath = this.productForm.product.productImagePath;
    this.onChangePage('U');
  }
}

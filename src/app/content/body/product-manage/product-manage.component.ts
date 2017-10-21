import { AlertService } from '../../../services/alert.service';
import { ManageProductForm } from '../../../forms/manage-product';
import { ProductService } from '../../../services/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, HostListener } from '@angular/core';
import { Product } from "../../../models/product";
import { CategoryService } from "../../../services/category.service";

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
  mode = 'S';

  // Datatables
  dtOptions: DataTables.Settings = {};

  // Image
  imagePath: any = '';

  // Loading
  loading = false;

  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    public categoryService: CategoryService) { }

  ngOnInit() {
    this.loading = true;
    window.scrollTo(0, 0);
    Promise.all([this.loadingProductList()])
      .then(successes => { this.loading = false });
    this.imagePath = './assets/img/empty.png'
    this.mode = 'S';
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthChange: false,
      info: false,
      pageLength: 10
    };
  }

  loadingProductList(): Promise<boolean> {
    return Promise.resolve(
      this.productService.fetchProductListData('')
        .then((products: Product[]) => {
          this.productListForm = [];
          let form: ManageProductForm;
          products.forEach(product => {
            form = new ManageProductForm();
            form.product = product
            form.category = this.categoryService.getCategoryByKey(product.productCategory);
            this.productListForm.push(form);
          });
          return false;
        })
        .catch(error => {
          this.alertService.error('เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ')
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          window.scrollTo(0, 0)
          return false;
        })
    )
  }

  resetFormGroup() {
    this.group = new FormGroup({
      'productName': new FormControl(this.productForm.product.productName, Validators.required),
      'productCategory': new FormControl(this.productForm.product.productCategory, Validators.required),
      'productDetail': new FormControl(this.productForm.product.productDetail),
      'status': new FormControl(this.productForm.product.status, Validators.required),
      'productPrice': new FormControl(this.productForm.product.productPrice, [Validators.required, Validators.pattern('[0-9]+')]),
      'file': new FormControl(null)
    });
  }


  onChangePage(mode: string) {
    if (mode === 'I') {
      this.mode = 'I';
      this.productForm = new ManageProductForm();
      this.productForm.product.productCategory = '1';
      this.productForm.product.status = 'Y';
      this.resetFormGroup();
    } else if (mode === 'U') {
      this.mode = 'U';
      this.resetFormGroup();
    } else {
      this.productForm = new ManageProductForm();
      this.loading = true;
      window.scrollTo(0, 0);
      Promise.all([this.loadingProductList()])
        .then(successes => { this.loading = true });
      this.mode = 'S';
    }
  }

  onBack() {
    this.ngOnDestroy();
    this.onChangePage('S');
  }

  onClickSubmit() {
    if (this.group.valid) {
      if (!this.productForm.product.productImagePath) {
        this.alertService.warn('กรุณาอัพโหลดไฟล์รูปภาพสินค้า')
        setTimeout(() => {
          this.alertService.clear();
        }, 5000);
        window.scrollTo(0, 0)
        return;
      }
      this.loading = true;
      this.productForm.product.productName = this.group.value.productName;
      this.productForm.product.productCategory = this.group.value.productCategory;
      this.productForm.product.productDetail = this.group.value.productDetail;
      this.productForm.product.status = this.group.value.status;
      this.productForm.product.productPrice = this.group.value.productPrice
      this.productService.addProduct(this.productForm)
        .then(data => {
          console.log('Success');
          this.loading = false;
          this.onChangePage('S');
          this.alertService.success('บันทึกสินค้าเรียบร้อย')
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          return;
        })
        .catch(error => {
          this.loading = false;
          this.onChangePage('S');
          this.ngOnDestroy();
          this.alertService.error('เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ')
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          console.log('Error : ' + error.message)
        });
    }
  }

  onUploadImage(event) {
    this.loading = true;
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const file: File = files[0];
      const name = Date.now();
      const imageName = `images/${name}.${file.type}`;
      if (file.size < 5000000) {
        this.productForm.product.productImageName = imageName;
        Promise.all([Promise.resolve(
          this.productService.addProductImage(file, imageName)
            .then((data) => {
              this.imagePath = data;
              this.productForm.product.productImagePath = data;
            })
        )]).then(success => { this.loading = false });
      } else {
        this.loading = false;
        this.alertService.warn('ขนาดไฟล์ไม่เกิน 5 mb')
        setTimeout(() => {
          this.alertService.clear();
        }, 5000);
        window.scrollTo(0, 0)
      }
    }
  }

  onDeleteImage() {
    this.imagePath = './assets/img/empty.png';
    if (this.productForm.product.productImageName) {
      if (this.mode === 'I') {
        this.productService.deleteProductImage(this.productForm.product.productImageName);
      }
      this.productForm.product.productImageName = '';
      this.productForm.product.productImagePath = '';
    }
  }

  onSelectRow(form: ManageProductForm) {
    this.productForm = form;
    if (this.productForm.product.productImagePath) {
      Promise.all([Promise.resolve(this.imagePath = this.productForm.product.productImagePath)]);
    } else {
      Promise.all([Promise.resolve(this.imagePath = './assets/img/empty.png')]);
    }
    this.onChangePage('U');
  }

  ngOnDestroy() {
    if (this.mode === 'I') {
      if (this.productForm.product.productImageName) {
        this.productService.deleteProductImage(this.productForm.product.productImageName);
      }
    }
  }


  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler($event) {
  //   $event.returnValue = this.ngOnDestroy();
  // }
}

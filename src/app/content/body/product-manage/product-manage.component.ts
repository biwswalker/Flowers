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
  imagePathS: any = '';
  imagePathM: any = '';
  imagePathL: any = '';

  // Loading
  loadingImage = false;
  loading = false;

  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    public categoryService: CategoryService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
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
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.alertService.error('เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ')
        setTimeout(() => {
          this.alertService.clear();
        }, 5000);
        window.scrollTo(0, 0)
      });
    this.imagePathS = './assets/img/empty.png'
    this.imagePathM = './assets/img/empty.png'
    this.imagePathL = './assets/img/empty.png'
    this.mode = 'S';
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
      'productType': new FormControl(this.productForm.product.productType, Validators.required),
      'productDetail': new FormControl(this.productForm.product.productDetail),
      'status': new FormControl(this.productForm.product.status, Validators.required),
      'sizeS': new FormControl(this.productForm.product.productSizeS),
      'sizeM': new FormControl(this.productForm.product.productSizeM),
      'sizeL': new FormControl(this.productForm.product.productSizeL),
      'productPriceS': new FormControl(this.productForm.product.productPriceS, Validators.pattern('[0-9]+')),
      'productPriceM': new FormControl(this.productForm.product.productPriceM, Validators.pattern('[0-9]+')),
      'productPriceL': new FormControl(this.productForm.product.productPriceL, Validators.pattern('[0-9]+')),
      'statusS': new FormControl(this.productForm.product.statusS),
      'statusM': new FormControl(this.productForm.product.statusM),
      'statusL': new FormControl(this.productForm.product.statusL),
      'fileS': new FormControl(null),
      'fileM': new FormControl(null),
      'fileL': new FormControl(null)
    });

    this.onChkSize('S', this.productForm.product.productSizeS);
    this.onChkSize('M', this.productForm.product.productSizeM);
    this.onChkSize('L', this.productForm.product.productSizeL);
  }

  onChkSize(size: string, tf: boolean) {
    const price = 'productPrice' + size;
    const status = 'status' + size;
    const file = 'file' + size;
    if (!tf) {
      this.group.controls[price].disable();
      this.group.controls[status].disable();
      this.group.controls[file].disable();
      this.group.controls[price].setValidators([Validators.required, Validators.pattern('[0-9]+')]);
      this.group.controls[status].setValidators(Validators.required);
      this.group.controls[price].setValue(null);
      this.group.controls[status].setValue(null);
      this.group.controls[file].setValue(null);
      this.onDeleteImage(size);
    } else {
      this.group.controls[price].enable();
      this.group.controls[status].enable();
      this.group.controls[file].enable();
      this.group.controls[price].setValidators(Validators.nullValidator);
      this.group.controls[status].setValidators(Validators.nullValidator);
    }
  }

  onChangePage(mode: string) {
    if (mode === 'I') {
      this.mode = 'I';
      this.productForm = new ManageProductForm();
      this.productForm.product.productType = 'S';
      this.productForm.product.status = 'Y';
      this.productForm.product.productSizeS = false;
      this.productForm.product.productSizeM = false;
      this.productForm.product.productSizeL = false;
      this.resetFormGroup();
    } else if (mode === 'U') {
      this.mode = 'U';
      this.resetFormGroup();
    } else {
      this.productForm = new ManageProductForm();
      this.loading = true;
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
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.alertService.error('เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ')
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          window.scrollTo(0, 0)
        });
      this.mode = 'S';
      this.imagePathS = './assets/img/empty.png';
      this.imagePathM = './assets/img/empty.png';
      this.imagePathL = './assets/img/empty.png';
    }
  }

  onBack() {
    this.ngOnDestroy();
    this.onChangePage('S');
  }

  onClickSubmit() {
    if (this.group.valid) {
      if (this.productForm.product.productSizeS) {
      } else if (this.productForm.product.productSizeM) {
      } else if (this.productForm.product.productSizeL) {
      } else {
        this.alertService.warn('กรุณาอัพโหลดไฟล์รูปภาพสินค้า อย่างน้อย 1 รูป')
        setTimeout(() => {
          this.alertService.clear();
        }, 5000);
        window.scrollTo(0, 0)
        return;
      }

      if (this.productForm.product.productSizeS) {
        if (!this.productForm.product.productImagePathS) {
          this.alertService.warn('กรุณาอัพโหลดไฟล์รูปภาพสินค้า')
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          window.scrollTo(0, 0)
          return;
        } else if (!this.group.value.productPriceS) {
          this.alertService.warn('กรุณากรอกราคา')
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          window.scrollTo(0, 0)
          return;
        }
        this.productForm.product.productPriceS = this.group.value.productPriceS;
        this.productForm.product.statusS = this.group.value.statusS;
      } else {
        this.productForm.product.productPriceS = 0;
        this.productForm.product.statusS = '';
      }

      if (this.productForm.product.productSizeM) {
        if (!this.productForm.product.productImagePathM) {
          this.alertService.warn('กรุณาอัพโหลดไฟล์รูปภาพสินค้า')
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          window.scrollTo(0, 0)
          return;
        } else if (!this.group.value.productPriceM) {
          this.alertService.warn('กรุณากรอกราคา')
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          window.scrollTo(0, 0)
          return;
        }
        this.productForm.product.productPriceM = this.group.value.productPriceM;
        this.productForm.product.statusM = this.group.value.statusM;
      } else {
        this.productForm.product.productPriceM = 0;
        this.productForm.product.statusM = '';
      }

      if (this.productForm.product.productSizeL) {
        if (!this.productForm.product.productImagePathL) {
          this.alertService.warn('กรุณาอัพโหลดไฟล์รูปภาพสินค้าขนาดใหญ่')
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          window.scrollTo(0, 0)
          return;
        } else if (!this.group.value.productPriceL) {
          this.alertService.warn('กรุณากรอกราคา')
          setTimeout(() => {
            this.alertService.clear();
          }, 5000);
          window.scrollTo(0, 0)
          return;
        }
        this.productForm.product.productPriceL = this.group.value.productPriceL;
        this.productForm.product.statusL = this.group.value.statusL;
      } else {
        this.productForm.product.productPriceL = 0;
        this.productForm.product.statusL = '';
      }

      this.loading = true;

      this.productForm.product.productName = this.group.value.productName;
      this.productForm.product.productCategory = this.group.value.productCategory;
      this.productForm.product.productType = this.group.value.productType;
      this.productForm.product.productDetail = this.group.value.productDetail;
      this.productForm.product.status = this.group.value.status;

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

  onUploadImage(event, size: string) {
    this.loadingImage = true;
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const file: File = files[0];
      const name = Date.now();
      const imageName = `images/${name}.${file.type}`;
      if (file.size < 5000000) {
        if (size === 'S') {
          this.productForm.product.productImageNameS = imageName;
          this.productService.addProductImage(file, imageName)
            .then((data) => {
              this.productForm.product.productImagePathS = data;
              this.imagePathS = data;
              this.loadingImage = false;
            });
        } else if (size === 'M') {
          this.productForm.product.productImageNameM = imageName;
          this.productService.addProductImage(file, imageName)
            .then((data) => {
              this.productForm.product.productImagePathM = data;
              this.imagePathM = data;
              this.loadingImage = false;
            });
        } else if (size === 'L') {
          this.productForm.product.productImageNameL = imageName;
          this.productService.addProductImage(file, imageName)
            .then((data) => {
              this.productForm.product.productImagePathL = data;
              this.imagePathL = data;
              this.loadingImage = false;
            });
        }
      }
    }
  }

  onDeleteImage(size: string) {
    if (size === 'S') {
      this.imagePathS = './assets/img/empty.png';
      if (this.productForm.product.productImageNameS) {
        if (this.mode === 'I') {
          this.productService.deleteProductImage(this.productForm.product.productImageNameS);
        }
        this.productForm.product.productImageNameS = '';
        this.productForm.product.productImagePathS = '';
      }
    } else if (size === 'M') {
      this.imagePathM = './assets/img/empty.png';
      if (this.productForm.product.productImageNameM) {
        if (this.mode === 'I') {
          this.productService.deleteProductImage(this.productForm.product.productImageNameM);
        }
        this.productForm.product.productImageNameM = '';
        this.productForm.product.productImagePathM = '';
      }
    } else if (size === 'L') {
      this.imagePathL = './assets/img/empty.png';
      if (this.productForm.product.productImageNameL) {
        if (this.mode === 'I') {
          this.productService.deleteProductImage(this.productForm.product.productImageNameL);
        }
        this.productForm.product.productImageNameL = '';
        this.productForm.product.productImagePathL = '';
      }
    } else {
      this.imagePathS = './assets/img/empty.png';
      this.imagePathM = './assets/img/empty.png';
      this.imagePathL = './assets/img/empty.png';
    }
  }

  onSelectRow(form: ManageProductForm) {
    this.productForm = form;
    if (this.productForm.product.productImagePathS) {
      this.imagePathS = this.productForm.product.productImagePathS;
    } else {
      this.imagePathS = './assets/img/empty.png';
    }

    if (this.productForm.product.productImagePathM) {
      this.imagePathM = this.productForm.product.productImagePathM;
    } else {
      this.imagePathM = './assets/img/empty.png';
    }

    if (this.productForm.product.productImagePathL) {
      this.imagePathL = this.productForm.product.productImagePathL;
    } else {
      this.imagePathL = './assets/img/empty.png';
    }
    this.onChangePage('U');
  }

  ngOnDestroy() {
    if (this.mode === 'I') {
      if (this.productForm.product.productImageNameS) {
        this.productService.deleteProductImage(this.productForm.product.productImageNameS);
      }
      if (this.productForm.product.productImageNameM) {
        this.productService.deleteProductImage(this.productForm.product.productImageNameM);
      }
      if (this.productForm.product.productImageNameL) {
        this.productService.deleteProductImage(this.productForm.product.productImageNameL);
      }
    }
  }


  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler($event) {
  //   $event.returnValue = this.ngOnDestroy();
  // }
}

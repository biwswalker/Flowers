import { StoreService } from '../../../../services/store.service';
import { Store } from '../../../../models/store';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-list-store',
  templateUrl: './list-store.component.html',
  styleUrls: ['./list-store.component.css']
})
export class ListStoreComponent implements OnInit {

  @Output() mode = new EventEmitter<string>();
  @Output() selectedStore = new EventEmitter<Store>();

  private storeList: Store[] = [];

  // Datatables
  dtOptions: DataTables.Settings = {};
  loaded = false;

  constructor(private storeService: StoreService) {
  }

  ngOnInit() {
    this.storeList = [];
    // this.storeService.fetchProductListData()
    //   .then(succes => {
    //     if (succes) {
    //       this.storeList = this.storeService.getStoreList()
    //       this.loaded = true;
    //     }
    //   }
    //   )

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthChange: false,
      info: false,
      pageLength: 10
    };
  }

  onSelectRow(store) {
    this.selectedStore.emit(store)
  }

  onInsert() {
    this.mode.emit('I')
  }
}

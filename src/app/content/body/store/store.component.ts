import { StoreService } from '../../../services/store.service';
import { Store } from '../../../models/store';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

  selectedStore: Store;

  private storeList: Store[] = [];

  // Datatables
  dtOptions: DataTables.Settings = {};
  loaded = false;

  currentMode = 'S';
    
  constructor(private storeService: StoreService) {
  }

  ngOnInit() {
    this.storeList = [];
    this.storeService.fetchStoreListData()
      .then(succes => {
        if (succes) {
          this.storeList = this.storeService.getStoreList()
          this.loaded = true;
        }
      }
      )

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthChange: false,
      info: false,
      pageLength: 10
    };
  }

  modeChanged(moe) {
    this.currentMode = 'S';
  }

  modeUpdate(store){
    // this.storeSelect = store;
    this.currentMode = 'U';
  }

  onSelectRow(store) {
    // this.selectedStore.emit(store)
  }

  onInsert() {
    // this.mode.emit('I')
  }
}

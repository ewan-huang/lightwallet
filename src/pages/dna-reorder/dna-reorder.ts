import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import {DnaReqWsSubscribeProvider} from "../../providers/dna-req-ws-subscribe/dna-req-ws-subscribe";
import { DnaAccountProvider } from '../../providers/dna-account/dna-account';

let DATA = require('../../data/data.js').default;

@IonicPage()
@Component({
    selector: 'page-dna-reorder',
    templateUrl: 'dna-reorder.html',
})
export class DnaReorderPage {

    assetOrder: Array<string>
    originalAssetOrder: Array<string>
    hiddenAsset: Array<string> = []
    originalHiddenAsset: Array<string> = []

    assets: any;

    savedDnaAssets: any;

    constructor(
        public navCtrl: NavController,
        public translate: TranslateService,
        public platform: Platform,
        private storage: Storage,
        private dnaAccount: DnaAccountProvider,
    ) {
        DnaReqWsSubscribeProvider.wsListAssets().then((assets) => {
            this.assets = [];
            if (assets && assets.length > 0) {
                for (var i = 0; i < assets.length; i ++) {
                    if (assets[i].id !== DATA.TOKEN_ASSET_ID) {
                        this.assets.push(assets[i].symbol);
                    }
                }
            }

            this.storage.get('saved_dna_assets').then((savedDnaAssets: any) => {
                this.savedDnaAssets = savedDnaAssets ? savedDnaAssets : {};
                this.storage.get('dnaUserInfo').then((userInfo) => {
                    if (userInfo
                            && userInfo.name
                            && savedDnaAssets
                            && savedDnaAssets[userInfo.name]
                            && savedDnaAssets[userInfo.name].order
                            && savedDnaAssets[userInfo.name].hidden) {
                        this.assetOrder          = savedDnaAssets[userInfo.name].order;
                        this.originalAssetOrder  = this.assetOrder.slice(0);
                        this.hiddenAsset         = savedDnaAssets[userInfo.name].hidden;
                        this.originalHiddenAsset = this.hiddenAsset.slice(0);
                    } else {
                        this.assetOrder          = [];
                        this.originalAssetOrder  = [];
                        this.hiddenAsset         = [];
                        this.originalHiddenAsset = [];
                    }
    
                    for (var i = 0; i < this.assets.length; i ++) {
                        if (this.assetOrder.indexOf(this.assets[i]) <= -1) {
                            this.assetOrder.push(this.assets[i]);
                            this.originalAssetOrder.push(this.assets[1]);
                        }
                    }
                });
            });
        });
    }

    async ionViewDidEnter() {

    }

    async save(assetOrder, hiddenAsset) {
        this.storage.get('dnaUserInfo').then((userInfo) => {
            if (userInfo && userInfo.name) {
                this.savedDnaAssets[userInfo.name] = {order: assetOrder, hidden: hiddenAsset};
                this.storage.set('saved_dna_assets', this.savedDnaAssets).then(() => {
                    this.navCtrl.pop();
                });
            }
        });
        //this.storage.set('saved_dna_assets', {order: assetOrder, hidden: hiddenAsset}).then(() => {
        //    this.navCtrl.pop();
        //});
    }

    compareArray(array1, array2) {
        if (array1 && array2 && array1.length === array2.length) {
            for (let i = 0; i < array1.length; i++) {
                if (array1[i] !== array2[i]) {
                    return false
                }
            }
            return true
        } else {
            return false
        }
    }

    cancel(e) {
        e.preventDefault()
        this.navCtrl.pop()
    }

    show(symbol) {
        for (let i = 0; i < this.hiddenAsset.length; i++) {
            if (this.hiddenAsset[i] === symbol) {
                this.hiddenAsset.splice(i, 1);
                i--;
            }
        }
    }

    hide(symbol) {
        this.hiddenAsset.push(symbol)
    }

    isVisible = symbol => !this.hiddenAsset || this.hiddenAsset.indexOf(symbol) == -1
}

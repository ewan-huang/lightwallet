import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetTransferPage } from './asset-transfer';
import { TranslateModule} from '@ngx-translate/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Keyboard } from '@ionic-native/keyboard';
import { AlertProvider } from '../../providers/alert/alert';
import { PipesModule } from '../../pipes/pipes.module';
import { AttenuationModelModule } from '../../components/attenuation-model-selector/attenuation-model-selector.module';

@NgModule({
    declarations: [
        AssetTransferPage
    ],
    imports: [
        IonicPageModule.forChild(AssetTransferPage),
        PipesModule,
        AttenuationModelModule,
        TranslateModule
    ],
    providers:[
        BarcodeScanner,
        Keyboard,
        AlertProvider
    ],
    exports: [
        AssetTransferPage
    ]
})
export class AssetTransferPageModule { }

import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import './methods.js';


export const Maps = new FilesCollection({
    collectionName: 'Maps',
    allowClientCode: true,
    downloadRoute: '/public/',

    onBeforeUpload(file){
        if(file.size <= 10485760 && /json|geojson/i.test(file.extension)){
            return true;
        }
        return 'Favor fazer upload de geojson válido';
    }
});

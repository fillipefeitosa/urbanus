import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const Images = new FilesCollection({
    collectionName: 'Images',
    allowClientCode: true, // Required to let you remove uploaded file,
    onBeforeUpload(file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.ext)) {
            return true;
        } else {
            return 'Please upload image, with size equal or less than 10MB';
        }
    }
});

if (Meteor.isClient) {
    Meteor.subscribe('files.images.all');
}

if (Meteor.isServer) {
    Meteor.publish('files.images.all', () => {
        return Images.collection.find({});
    });
}


// Start of new code
// var bound, client, fs, Images = {};
// var Dropbox = require('dropbox');
// var Request = require('request');
//
// if (Meteor.isServer) {
//     // Dropbox = Npm.require('dropbox');
//     // Request = Npm.require('request');
//     fs = Npm.require('fs');
//     bound = Meteor.bindEnvironment(function(callback) {
//         return callback();
//     });
//     client = new Dropbox.Client({
//         key: '0vlaj4nc89mb9dn',
//         secret: 'jei0j0a6v6396pi',
//         token: 'kIxvp6G2_mQAAAAAAAAB60gPKkRKmtPiFsSU-PlZEFORt6PojQeZNBfsYfiNKgN4'
//     });
// }
//
// Images.files = new FilesCollection({
//     debug: false, // Change to `true` for debugging
//     storagePath: 'assets/app/uploads/uploadedFiles',
//     collectionName: 'uploadedFiles',
//     allowClientCode: false,
//     onAfterUpload: function(fileRef) {
//         // In onAfterUpload callback we will move file to DropBox
//         var self = this;
//         var makeUrl = function(stat, fileRef, version, triesUrl) {
//             if (triesUrl == null) {
//                 triesUrl = 0;
//             }
//             client.makeUrl(stat.path, {
//                 long: true,
//                 downloadHack: true
//             }, function(error, xml) {
//                 // Store downloadable link in file's meta object
//                 bound(function() {
//                     if (error) {
//                         if (triesUrl < 10) {
//                             Meteor.setTimeout(function() {
//                                 makeUrl(stat, fileRef, version, ++triesUrl);
//                             }, 2048);
//                         } else {
//                             console.error(error, {
//                                 triesUrl: triesUrl
//                             });
//                         }
//                     } else if (xml) {
//                         var upd = {
//                             $set: {}
//                         };
//                         upd['$set']["versions." + version + ".meta.pipeFrom"] = xml.url;
//                         upd['$set']["versions." + version + ".meta.pipePath"] = stat.path;
//                         self.collection.update({
//                             _id: fileRef._id
//                         }, upd, function(error) {
//                             if (error) {
//                                 console.error(error);
//                             } else {
//                                 // Unlink original files from FS
//                                 // after successful upload to DropBox
//                                 self.unlink(self.collection.findOne(fileRef._id), version);
//                             }
//                         });
//                     } else {
//                         if (triesUrl < 10) {
//                             Meteor.setTimeout(function() {
//                                 makeUrl(stat, fileRef, version, ++triesUrl);
//                             }, 2048);
//                         } else {
//                             console.error("client.makeUrl doesn't returns xml", {
//                                 triesUrl: triesUrl
//                             });
//                         }
//                     }
//                 });
//             });
//         };
//
//         var writeToDB = function(fileRef, version, data, triesSend) {
//             // DropBox already uses random URLs
//             // No need to use random file names
//             if (triesSend == null) {
//                 triesSend = 0;
//             }
//             client.writeFile(fileRef._id + "-" + version + "." + fileRef.extension, data, function(error, stat) {
//                 bound(function() {
//                     if (error) {
//                         if (triesSend < 10) {
//                             Meteor.setTimeout(function() {
//                                 writeToDB(fileRef, version, data, ++triesSend);
//                             }, 2048);
//                         } else {
//                             console.error(error, {
//                                 triesSend: triesSend
//                             });
//                         }
//                     } else {
//                         // Generate downloadable link
//                         makeUrl(stat, fileRef, version);
//                     }
//                 });
//             });
//         };
//
//         var readFile = function(fileRef, vRef, version, triesRead) {
//             if (triesRead == null) {
//                 triesRead = 0;
//             }
//             fs.readFile(vRef.path, function(error, data) {
//                 bound(function() {
//                     if (error) {
//                         if (triesRead < 10) {
//                             readFile(fileRef, vRef, version, ++triesRead);
//                         } else {
//                             console.error(error);
//                         }
//                     } else {
//                         writeToDB(fileRef, version, data);
//                     }
//                 });
//             });
//         };
//
//         var sendToStorage = function(fileRef) {
//             _.each(fileRef.versions, function(vRef, version) {
//                 readFile(fileRef, vRef, version);
//             });
//         };
//
//         sendToStorage(fileRef);
//     },
//     interceptDownload: function(http, fileRef, version) {
//         var path, ref, ref1, ref2;
//         path = (ref = fileRef.versions) != null ? (ref1 = ref[version]) != null ? (ref2 = ref1.meta) != null ? ref2.pipeFrom : void 0 : void 0 : void 0;
//         if (path) {
//             // If file is moved to DropBox
//             // We will pipe request to DropBox
//             // So, original link will stay always secure
//             Request({
//                 url: path,
//                 headers: _.pick(http.request.headers, 'range', 'accept-language', 'accept', 'cache-control', 'pragma', 'connection', 'upgrade-insecure-requests', 'user-agent')
//             }).pipe(http.response);
//             return true;
//         } else {
//             // While file is not yet uploaded to DropBox
//             // We will serve file from FS
//             return false;
//         }
//     }
// });
//
// if (Meteor.isServer) {
//     // Intercept File's collection remove method
//     // to remove file from DropBox
//     var _origRemove = Images.files.remove;
//
//     Images.files.remove = function(search) {
//         var cursor = this.collection.find(search);
//         cursor.forEach(function(fileRef) {
//             _.each(fileRef.versions, function(vRef) {
//                 var ref;
//                 if (vRef != null ? (ref = vRef.meta) != null ? ref.pipePath : void 0 : void 0) {
//                     client.remove(vRef.meta.pipePath, function(error) {
//                         bound(function() {
//                             if (error) {
//                                 console.error(error);
//                             }
//                         });
//                     });
//                 }
//             });
//         });
//         // Call original method
//         _origRemove.call(this, search);
//     };
// }

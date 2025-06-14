"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
const pick = (obj, keys) => {
    let pickedObject = {};
    console.log(obj, keys);
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            pickedObject[key] = obj[key];
        } // get the object and see if the key is in object key and it has property or not and the obj && means if there is req.query options or not
    }
    console.log("poo", pickedObject);
    return pickedObject;
};
exports.pick = pick;

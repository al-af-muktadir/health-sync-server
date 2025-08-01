export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  let pickedObject: Partial<T> = {};
  console.log(obj, keys);
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      pickedObject[key] = obj[key];
    } // get the object and see if the key is in object key and it has property or not and the obj && means if there is req.query options or not
  }
  // ("pconsole.logoo", pickedObject);
  return pickedObject;
};

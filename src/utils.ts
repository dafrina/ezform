export const deepGet = (obj: any, path: string) => {
	path = path.replaceAll("[", ".[");
	const keys = path.split(".");
	const length = keys.length;
	for (let i = 0; i < length; i++) {
		const key = keys[i];
		if (key.includes("[")) {
			obj = obj[parseInt(key.substring(1, key.length - 1))];
		} else {
			obj = obj[keys[i]];
		}
	}
	return obj;
};

export const deepSet = (obj: any, path: string, val: any) => {
	path = path.replaceAll("[", ".[");
	const keys = path.split(".");

	for (let i = 0; i < keys.length; i++) {
		let currentKey = keys[i] as any;
		let nextKey = keys[i + 1] as any;
		if (currentKey.includes("[")) {
			currentKey = parseInt(currentKey.substring(1, currentKey.length - 1));
		}
		if (nextKey && nextKey.includes("[")) {
			nextKey = parseInt(nextKey.substring(1, nextKey.length - 1));
		}

		if (typeof nextKey !== "undefined") {
			obj[currentKey] = obj[currentKey] ? obj[currentKey] : (isNaN(nextKey) ? {} : []);
		} else {
			obj[currentKey] = val;
		}

		obj = obj[currentKey];
	}
};

export const flatten = (obj: any, result = {}, key = "") =>{
	if(Array.isArray(obj)) {
		obj.forEach((d,i) => {
			result = flatten(d, result, key + `[${i}]`);
		});
	}
	else if(typeof obj === "object") {
		for (const i of Object.keys(obj)) {
			result = flatten(obj[i], result, key ? key + `.${i}` : `${i}`);
		}
	}
	else {
		result[key] = obj;
	}
	return result;
};

export const shallowEqual = (object1, object2) => {
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);
	if (keys1.length !== keys2.length) {
		return false;
	}
	for (const key of keys1) {
		if (typeof object1[key] !== "function" && typeof object1[key] !== "object") {
			if (object1[key] !== object2[key]) {
				return false;
			}
		}
	}
	return true;
};

export const propsEqual = (prev, next) => {
	if (prev.form.hasError(prev.name) !== next.form.hasError(prev.name)) {
		return false;
	}

	return shallowEqual(prev, next) && prev.form.getField(prev.name) === next.form.getField(prev.name);
};

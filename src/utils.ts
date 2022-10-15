export const isObjectEmpty = (obj: any) => Object.keys(obj).length === 0;

export const deepGet = (obj: any, path: string) => {
	path = path.replaceAll("[", ".[");
	const keys = path.split(".");
	const length = keys.length;
	for (let i = 0; i < length; i++) {
		const key = keys[i];
		if (key.includes("[")) {
			obj = obj?.[parseInt(key.substring(1, key.length - 1))];
		} else {
			obj = obj?.[keys[i]];
		}
	}
	return obj;
};

export const deepSet = (obj: any, path: string, val: any) => {
	if (!val || val === "") return;

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
			obj[currentKey] = obj[currentKey] ? obj[currentKey] : isNaN(nextKey) ? {} : [];
		} else {
			obj[currentKey] = val;
		}

		obj = obj[currentKey];
	}
};

export const flatten = (obj: any, result = {}, key = "") => {
	if (Array.isArray(obj)) {
		if (obj.length > 0) {
			obj.forEach((d, i) => {
				if (typeof d === "string" || !isNaN(d)) {
					result[key] = obj;
				} else {
					result = flatten(d, result, key + `[${i}]`);
				}
			});
		} else {
			result[key] = [];
		}
	} else if (obj && typeof obj === "object" && !isObjectEmpty(obj)) {
		for (const i of Object.keys(obj)) {
			result = flatten(obj[i], result, key ? key + `.${i}` : `${i}`);
		}
	} else {
		result[key] = obj;
	}
	return result;
};

export const unflatten = (obj: any) => {
	const values = {};

	Object.keys(obj).forEach((k) => {
		if (obj[k] !== null) {
			deepSet(values, k, obj[k]);
		}
	});

	return values;
};

export const deepEquals = (object1: any, object2: any) => {
	const ignoreProps = ["form", "validator"];

	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);
	if (keys1.length !== keys2.length) {
		return false;
	}
	for (const key of keys1) {
		if (ignoreProps.includes(key)) continue;
		if (JSON.stringify(object1[key]) !== JSON.stringify(object2[key])) {
			return false;
		}
	}
	return true;
};

export const propsEqual = (prev: any, next: any) => {
	let eq = true;
	if (prev.form.hasError(prev.name) !== next.form.hasError(prev.name)) {
		eq = false;
	} else {
		eq =
			deepEquals(prev, next) &&
			prev.form.getField(prev.name) === next.form.getField(prev.name);
	}
	return eq;
};

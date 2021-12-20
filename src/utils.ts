export const set = (obj, path, val) => {
	path = path.replace("[", ".[");
	const keys = path.split(".");
	const lastKey = keys.pop();
	let lastObj = keys.reduce((obj, key, currentIndex) => {
		if (key.includes("[")) {
			return obj[key.substring(1, key.length-1)];
		}
		if (obj[key] && obj[key].length && (keys[currentIndex+1] && keys[currentIndex+1].includes("["))) {
			let nextKey = keys[currentIndex+1];
			nextKey = nextKey.substring(1, nextKey.length-1);
			!obj[key][nextKey] && obj[key].push({});
		}
		return obj[key] = obj[key] || ((keys[currentIndex+1] && keys[currentIndex+1].includes("[")) ? [{}] : keys[currentIndex+1] ? {} : val);
	}
	, obj);
	lastObj[lastKey] = val;
};

export const flatten = (obj, result = {}, key = "") =>{
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

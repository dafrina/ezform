export const shallowEqual = (object1, object2) => {
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);
	if (keys1.length !== keys2.length) {
		return false;
	}
	for (let key of keys1) {
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

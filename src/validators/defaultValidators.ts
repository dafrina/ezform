export const requiredValidator = (value) => {
	if (!value || value === '') {
		return "This field cannot be empty";
	}
	return null;
};

export const requiredListValidator = (value) => {
	if (!value || value.length < 1) {
		return "Please select at least one";
	}
	return null;
};

export const emailValidator = (value) => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(String(value).toLowerCase())) {
		return "Please enter a valid email";
	}
	return null;
};

export const urlValidator = (value) => {
	try {
		new URL(value);
	} catch (e) {
		return "Please enter a valid URL";
	}
	return null;
};

export const numberValidator = (value) => {
	if (isNaN(Number(value))) {
		return "Please enter a valid number"
	}
	return null;
};

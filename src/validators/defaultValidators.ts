export const requiredValidator = (value, formatMessage) => {
	if (!value || value === "") {
		return formatMessage ? formatMessage("validation.error.required") : "This field cannot be empty";
	}
	return null;
};

export const requiredListValidator = (value, formatMessage) => {
	if (!value || value.length < 1) {
		return formatMessage ? formatMessage("validation.error.required_list") : "Please select at least one";
	}
	return null;
};

export const emailValidator = (value, formatMessage) => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(String(value).toLowerCase())) {
		return formatMessage ? formatMessage("validation.error.email") : "Please enter a valid email";
	}
	return null;
};

export const urlValidator = (value, formatMessage) => {
	try {
		new URL(value);
	} catch (e) {
		return formatMessage ? formatMessage("validation.error.url") : "Please enter a valid URL";
	}
	return null;
};

export const numberValidator = (value, formatMessage) => {
	if (isNaN(Number(value))) {
		return formatMessage ? formatMessage("validation.error.number") : "Please enter a valid number";
	}
	return null;
};

export const dateValidator = (value, formatMessage) => {
	if (value === null || isNaN(value)) {
		return formatMessage ? formatMessage("validation.error.date") : "Please select a date";
	}
	return null;
}

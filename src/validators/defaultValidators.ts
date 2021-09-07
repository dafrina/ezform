import {FieldType, ValidatorType} from "../hooks";

export const requiredValidator: ValidatorType = (value, formatMessage) => {
	if (!value || value === "") {
		return formatMessage ? formatMessage("validation.error.required") : "This field cannot be empty";
	}
	return null;
};

export const requiredListValidator: ValidatorType = (value, formatMessage) => {
	if (!value || value.length < 1) {
		return formatMessage ? formatMessage("validation.error.required_list") : "Please select at least one";
	}
	return null;
};

export const emailValidator: ValidatorType = (value, formatMessage) => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(String(value).toLowerCase())) {
		return formatMessage ? formatMessage("validation.error.email") : "Please enter a valid email";
	}
	return null;
};

export const urlValidator: ValidatorType = (value, formatMessage) => {
	try {
		new URL(value);
	} catch (e) {
		return formatMessage ? formatMessage("validation.error.url") : "Please enter a valid URL";
	}
	return null;
};

export const numberValidator: ValidatorType = (value, formatMessage) => {
	if (isNaN(Number(value))) {
		return formatMessage ? formatMessage("validation.error.number") : "Please enter a valid number";
	}
	return null;
};

export const dateValidator: ValidatorType = (value, formatMessage) => {
	if (value === null || isNaN(value)) {
		return formatMessage ? formatMessage("validation.error.date") : "Please select a date";
	}
	return null;
};

export const fileValidator: ValidatorType = (value, formatMessage) => {
	if (!value) {
		return formatMessage ? formatMessage("validation.error.file") : "Please select a file";
	}
	return null;
};

export const combinedValidator = (validators: ValidatorType[]): ValidatorType => (value, formatMessage) => {
	let re = null;
	for (let i = 0; i < validators.length; i++) {
		re = validators[i](value, formatMessage);
		if (re) {
			return re;
		}
	}
	return re;
};

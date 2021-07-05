import { useState } from "react";

export interface FormRefObject {
	fields: any;
	setFields: (f: (prevState: any) => any) => void;
	getField: (name: string) => any;
	setField: (name: string, value: any) => void;
	errors: any;
	setValidators: (f: any) => void;
	handleChange: (name: string, value: any, validator?: (value: string) => string | null) => void;
	submit: () => void;
	hasError: (name: string) => boolean;
	getHelperText: (name: string) => string | null;
}

export const useForm = (onSubmit: (values: any) => void, initialState: any = {}) => {
	const [fields, setFields] = useState(initialState);
	const [errors, setErrors] = useState({});
	const [validators, setValidators] = useState({});

	const hasError = (name: string) => {
		if (errors[name]) {
			return true;
		}
		return false;
	};

	const getHelperText = (name: string) => {
		if (errors[name]) {
			return errors[name];
		}
		return null;
	};

	const validateFields = () => {
		let hasErrors = false;
		Object.keys(validators).forEach((v) => {
			const value = fields?.[v];

			if (validators[v]) {
				const validatorResult = validators[v](value);

				setErrors((prev) => ({ ...prev, [v]: validatorResult }));

				if (validatorResult) {
					hasErrors = true;
				}
			}
		});

		return hasErrors;
	};

	const submit = () => {
		const hasErrors = validateFields();

		if (!hasErrors) {
			onSubmit(fields);
		} else {
			console.log("The form contains errors. Submit disabled");
		}
	};

	const handleChange = (name: string, value: any, validator?: (value: string) => string | null) => {
		setFields((prev) => ({ ...prev, [name]: value }));

		if (validator) {
			const validatorResult = validator(value);

			setErrors((prev) => ({ ...prev, [name]: validatorResult }));
		}
	};

	const getField = (name) => {
		return fields?.[name];
	};

	const setField = (name, value) => {
		setFields((prev) => ({ ...prev, [name]: value }));
	};

	return {
		fields,
		setFields,
		getField,
		setField,
		errors,
		setValidators,
		handleChange,
		submit,
		hasError,
		getHelperText,
	} as FormRefObject;
};

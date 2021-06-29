import { useState } from "react";

export interface FormRefObject {
	fields: any;
	setFields: (f: any) => void;
	errors: any;
	setValidators: (f: any) => void;
	handleChange: (name: string, value: any, validator?: (value: string) => string | null) => void;
	submit: () => void;
	hasError: (name: string) => boolean;
	getHelperText: (name: string) => string | null;
}

const useForm = (onSubmit: (values: any) => void, initialState?: any = {}) => {
	const [fields, setFields] = useState(initialState);
	const [errors, setErrors] = useState({});
	const [validators, setValidators] = useState({});

	const hasError = (name) => {
		if (errors[name]) {
			return true;
		}
		return false;
	};

	const getHelperText = (name) => {
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

	const handleChange = (name, value, validator) => {
		setFields((prev) => ({ ...prev, [name]: value }));

		if (validator) {
			const validatorResult = validator(value);

			setErrors((prev) => ({ ...prev, [name]: validatorResult }));
		}
	};

	return {
		fields,
		setFields,
		errors,
		setValidators,
		handleChange,
		submit,
		hasError,
		getHelperText,
	} as FormRefObject;
};

export default useForm;

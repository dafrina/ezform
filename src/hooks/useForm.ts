import { useRef, useState } from "react";

export interface FormRefObject {
	fields: any;
	setFields: (f: (prevState: any) => any) => void;
	getField: (name: string) => any;
	setField: (name: string, value: any, validateImmediately?: boolean) => void;
	errors: any;
	setValidators: (f: (prevState: any) => any) => void;
	submit: () => void;
	hasError: (name: string) => boolean;
	getHelperText: (name: string) => string | null;
	validators: any;
	formatMessage?: (messageKey: string) => string;
}

export interface FormConfig {
	onSubmit: (values: any) => void;
	initialState?: any;
	formatMessage?: (messageKey: string) => string;
}

export const useForm = ({onSubmit, initialState = {}, formatMessage}: FormConfig) => {
	const [fields, setFields] = useState(initialState);
	const [errors, setErrors] = useState({} as any);
	const [validators, setValidators] = useState({} as any);
	const validatorsRef = useRef(validators);
	validatorsRef.current = validators;

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
				const validatorResult = validators[v](value, formatMessage);

				setErrors((prev: any) => ({ ...prev, [v]: validatorResult }));

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

	const getField = (name: string) => {
		return fields?.[name];
	};

	const setField = (name: string, value: any, validateImmediately = true) => {
		setFields((prev: any) => ({ ...prev, [name]: value }));

		if (validateImmediately && validatorsRef.current[name]) {
			const validatorResult = validatorsRef.current[name](value, formatMessage);

			setErrors((prev: any) => ({ ...prev, [name]: validatorResult }));
		}
	};

	return {
		fields,
		setFields,
		getField,
		setField,
		errors,
		setValidators,
		submit,
		hasError,
		getHelperText,
		formatMessage,
	} as FormRefObject;
};

import { useRef, useState } from "react";

export interface FormRefObject {
	fields: any;
	setFields: (f: (prevState: any) => any) => void;
	getField: (name: string) => any;
	setField: (name: string, value: any, validateImmediately?: boolean) => void;
	submit: () => void;
	errors: any;
	hasError: (name: string) => boolean;
	hasErrors: () => boolean;
	getHelperText: (name: string) => string | null;
	validators: any;
	setValidators: (f: (prevState: any) => any) => void;
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
		return !!errors[name];

	};

	const hasErrors = () => {
		return Object.values(errors).map(e => !!e).filter(b => b).length > 0;
	}

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
			console.log("The form contains errors. Form was not submitted");
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
		hasError,
		hasErrors,
		submit,
		getHelperText,
		formatMessage,
		validators,
		setValidators,
	} as FormRefObject;
};

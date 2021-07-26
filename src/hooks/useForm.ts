import { Dispatch, SetStateAction, useRef, useState } from "react";

export type FieldType = any | null;
export type MountedType = boolean | null;
export type ErrorType = string | null;
export type FormatMessageType = (messageKey: string) => string;
export type ValidatorType = (value: FieldType, formatMessage?: FormatMessageType) => string | null;

interface FieldValues {
	[key: string]: FieldType;
}

interface MountedValues {
	[key: string]: MountedType;
}

interface ErrorValues {
	[key: string]: ErrorType;
}

interface ValidatorValues {
	[key: string]: ValidatorType;
}

export interface FormRefObject {
	fields: FieldValues;
	setFields: Dispatch<SetStateAction<FieldValues>>;
	getField: (name: string) => FieldType;
	setField: (name: string, value: FieldType, validateImmediately?: boolean) => void;
	errors: ErrorValues;
	setErrors: Dispatch<SetStateAction<ErrorValues>>;
	hasError: (name: string) => boolean;
	hasErrors: () => boolean;
	submit: () => void;
	reset: () => void;
	getHelperText: (name: string) => string | null;
	formatMessage?: FormatMessageType;
	validators: ValidatorValues;
	setValidators: Dispatch<SetStateAction<ValidatorValues>>;
	setMounted: Dispatch<SetStateAction<MountedValues>>;
}

export interface FormConfig {
	onSubmit: (values: FieldValues) => void;
	initialState?: FieldValues;
	formatMessage?: FormatMessageType;
}

export const useForm = ({onSubmit, initialState = {}, formatMessage}: FormConfig): FormRefObject => {
	const [fields, setFields] = useState(initialState as FieldValues);
	const [mounted, setMounted] = useState(initialState as MountedValues);
	const [errors, setErrors] = useState({} as ErrorValues);
	const [validators, setValidators] = useState({} as ValidatorValues);
	const validatorsRef = useRef(validators);
	validatorsRef.current = validators;

	const hasError = (name: string) => {
		return !!errors[name];

	};

	const hasErrors = () => {
		return Object.values(errors)
			.map(e => !!e)
			.filter(b => b)
			.length > 0;
	};

	const getHelperText = (name: string) => {
		if (errors[name]) {
			return errors[name];
		}
		return null;
	};

	const validateFields = () => Object.keys(validators)
		.map((v) => {
			if (validators[v]) {
				const value = fields?.[v];
				const validatorResult = validators[v](value, formatMessage);
				setErrors((prev) => ({ ...prev, [v]: validatorResult }));
				return validatorResult;
			}
		})
		.filter((v) => v)
		.length > 0;

	const submit = () => {
		const hasErrors = validateFields();

		if (!hasErrors) {
			const values = {};

			Object.keys(fields).forEach((k) => {
				if (mounted[k] && fields[k]) {
					values[k] = fields[k];
				}
			});

			onSubmit(values);
		} else {
			console.log("The form contains errors. Form was not submitted");
		}
	};

	const reset = () => {
		setFields(initialState);
		setErrors({});
	};

	const getField = (name: string) => {
		return fields?.[name];
	};

	const setField = (name: string, value: FieldType, validateImmediately = true) => {
		setFields((prev) => ({ ...prev, [name]: value }));

		const validator = validatorsRef.current[name];

		if (validateImmediately && validator) {
			const validatorResult = validator(value, formatMessage);

			setErrors((prev) => ({ ...prev, [name]: validatorResult }));
		}
	};

	return {
		fields,
		setFields,
		getField,
		setField,
		errors,
		setErrors,
		hasError,
		hasErrors,
		submit,
		reset,
		getHelperText,
		formatMessage,
		validators,
		setValidators,
		setMounted,
	};
};

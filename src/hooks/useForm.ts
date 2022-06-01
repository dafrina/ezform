import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { EzformConfig } from "../config";
import { deepSet, flatten } from "../utils";

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
	getFields: () => FieldValues;
	setFields: (setterFunction: (prevState: FieldValues) => FieldValues, validateImmediately?: boolean) => void;
	getField: (name: string) => FieldType;
	setField: (name: string, value: FieldType, validateImmediately?: boolean) => void;
	getErrors: () => ErrorValues;
	setErrors: Dispatch<SetStateAction<ErrorValues>>;
	hasError: (name: string) => boolean;
	hasErrors: () => boolean;
	submit: () => void;
	reset: () => void;
	getHelperText: (name: string) => string | null;
	formatMessage?: FormatMessageType;
	getValidators: () => ValidatorValues;
	setValidators: Dispatch<SetStateAction<ValidatorValues>>;
	setMounted: Dispatch<SetStateAction<MountedValues>>;
	isReadonly: boolean;
}

export interface FormConfig {
	onSubmit: (values: FieldValues) => void;
	initialState?: FieldValues;
	formatMessage?: FormatMessageType;
	submitUnmountedFields?: boolean;
	isReadonly?: boolean;
	logging?: {
		warnOnErrors: boolean,
		logFields: boolean,
	}
}

export const useForm = (props: FormConfig): FormRefObject => {

	const {onSubmit, initialState, formatMessage, submitUnmountedFields, isReadonly, logging} = {...EzformConfig(), ...props};

	const [fields, setFields] = useState(flatten(initialState) as FieldValues);
	const [mounted, setMounted] = useState({} as MountedValues);
	const [errors, setErrors] = useState({} as ErrorValues);
	const [validators, setValidators] = useState({} as ValidatorValues);
	const validatorsRef = useRef(validators);
	const fieldsRef = useRef(fields);
	const mountedRef = useRef(mounted);
	const errorsRef = useRef(errors);
	validatorsRef.current = validators;
	fieldsRef.current = fields;
	mountedRef.current = mounted;
	errorsRef.current = errors;
	const [validateNow, setValidateNow] = useState(false);

	useEffect(() => {
		if (initialState) {
			setFields((prevState: FieldValues) => (Object.assign(prevState, flatten(initialState))));
		}
	}, [initialState]);

	const hasError = (name: string) => {
		return !!errors[name];
	};

	const hasErrors = () => {
		return Object.values(errorsRef)
			.map(e => !!e)
			.filter(b => b)
			.length > 0;
	};

	const getHelperText = (name: string) => {
		if (errorsRef.current[name]) {
			return errorsRef.current[name];
		}
		return null;
	};

	const validateFields = () => Object.keys(validatorsRef.current)
		.map((v) => {
			if (validatorsRef.current[v]) {
				const value = fieldsRef.current?.[v];
				const validatorResult = validatorsRef.current[v](value, formatMessage);
				setErrors((prev) => ({ ...prev, [v]: validatorResult }));
				return validatorResult;
			}
		})
		.filter((v) => v).length > 0;

	const submit = () => {
		if (isReadonly) {
			console.warn("Submission is not allowed on readonly forms!");
			return;
		}

		const hasErrors = validateFields();

		if (logging.logFields) {
			console.log("Form fields", fieldsRef.current);
		}

		if (!hasErrors) {
			const values = {};

			Object.entries(fieldsRef.current).forEach(([k, value]) => {
				if (value !== null) {
					if (submitUnmountedFields || mountedRef.current[k]) {
						deepSet(values, k, value);
					}
				}
			});

			onSubmit(values);
		} else {
			if (logging.warnOnErrors) {
				console.warn("The form contains errors. Form not submitted");
			}
		}
	};

	const reset = () => {
		setFields(flatten(initialState));
		setErrors({});
	};

	const getField = (name: string) => {
		return fieldsRef.current?.[name];
	};

	const setField = (name: string, value: FieldType, validateImmediately = true) => {
		setFields((prev) => ({ ...prev, [name]: value }));

		const validator = validatorsRef.current[name];

		if (validateImmediately && validator) {
			const validatorResult = validator(value, formatMessage);

			setErrors((prev) => ({ ...prev, [name]: validatorResult }));
		}
	};

	const getNestedState = (state: any) => () => {
		const values = {};

		Object.keys(state).forEach((k) => {
			if (state[k] !== null) {
				deepSet(values, k, state[k]);
			}
		});

		return values;
	};

	const fieldsSetter = (setterFunction: (prevState: FieldValues) => FieldValues, validateImmediately?: boolean) => {
		setFields((prevState) => flatten(setterFunction(getNestedState(prevState)())));
		if (validateImmediately) {
			setValidateNow(true);
		}
	};

	useEffect(() => {
		if (validateNow) {
			validateFields();
			setValidateNow(false);
		}
	}, [validatorsRef.current]);

	return {
		getFields: getNestedState(fieldsRef.current),
		setFields: fieldsSetter,
		getField,
		setField,
		getErrors: getNestedState(errorsRef.current),
		setErrors,
		hasError,
		hasErrors,
		submit,
		reset,
		getHelperText,
		formatMessage,
		getValidators: getNestedState(validatorsRef.current),
		setValidators,
		setMounted,
		isReadonly,
	};
};

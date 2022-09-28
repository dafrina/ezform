import {Dispatch, RefObject, SetStateAction, useEffect, useRef, useState} from "react";
import { EzformConfig } from "../config";
import { deepSet, flatten } from "../utils";

export type FieldType = any | null;
export type MountedType = boolean | null;
export type ErrorType = string | null;
export type ValidatorType = (value: FieldType, fields: FieldValues, formatMessage?: any) => string | null;

export interface FieldValues {
	[key: string]: FieldType;
}

export interface MountedValues {
	[key: string]: MountedType;
}

export interface ErrorValues {
	[key: string]: ErrorType;
}

export interface ValidatorValues {
	[key: string]: ValidatorType;
}

export interface FormRefObject {
	getFields: () => FieldValues;
	setFields: (setterFunction: (prevState: FieldValues) => FieldValues) => void;
	getField: (name: string) => FieldType;
	setField: (name: string, value: FieldType, validateImmediately?: boolean) => void;
	getErrors: () => ErrorValues;
	setErrors: Dispatch<SetStateAction<ErrorValues>>;
	hasError: (name: string) => boolean;
	hasErrors: () => boolean;
	submit: (validate?: boolean) => void;
	reset: () => void;
	getHelperText: (name: string) => string | null;
	formatMessage?: any;
	validatorsRef: RefObject<ValidatorValues>;
	setMounted: Dispatch<SetStateAction<MountedValues>>;
	isReadonly: boolean;
	validate: () => boolean;
}

export interface FormConfig {
	onSubmit: (values: FieldValues) => void;
	initialState?: FieldValues;
	formatMessage?: any;
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
	const validatorsRef = useRef({} as ValidatorValues);
	const fieldsRef = useRef(fields);
	const mountedRef = useRef(mounted);
	const errorsRef = useRef(errors);
	fieldsRef.current = fields;
	mountedRef.current = mounted;
	errorsRef.current = errors;

	useEffect(() => {
		if (initialState) {
			setFields((prevState: FieldValues) => (Object.assign(prevState, flatten(initialState))));
		}
	}, [initialState]);

	const hasError = (name: string) => {
		return !!errors[name];
	};

	const hasErrors = () => {
		return Object.values(errorsRef.current)
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

	const validateFields = () => Object.keys(mountedRef.current)
		.map((v) => {
			if (validatorsRef.current[v]) {
				const value = fieldsRef.current?.[v];
				const validatorResult = validatorsRef.current[v](value, fieldsRef.current, formatMessage);
				setErrors((prev) => ({ ...prev, [v]: validatorResult }));
				return validatorResult;
			} else {
				setErrors((prev) => ({ ...prev, [v]: null }));
				return null;
			}
		})
		.filter((v) => v).length > 0;

	const submit = (validate = true) => {
		if (isReadonly) {
			console.warn("Submission is not allowed on readonly forms!");
			return;
		}

		if (logging.logFields) {
			console.log("Form fields", fieldsRef.current);
		}

		let hasErrors = false;
		if (validate) {
			hasErrors = validateFields();
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
		return fields?.[name];
	};

	const setField = (name: string, value: FieldType, validateImmediately = true) => {
		setFields((prev) => ({ ...prev, [name]: value }));

		const validator = validatorsRef.current[name];

		if (validateImmediately && validator) {
			const validatorResult = validator(value, fieldsRef.current, formatMessage);

			setErrors((prev) => ({ ...prev, [name]: validatorResult }));
		}
	};

	const getNestedState = (state) => () => {
		const values = {};

		Object.keys(state).forEach((k) => {
			if (state[k] !== null) {
				deepSet(values, k, state[k]);
			}
		});

		return values;
	};

	const fieldsSetter = (setterFunction: (prevState: FieldValues) => FieldValues) => {
		setFields((prevState) => flatten(setterFunction(getNestedState(prevState)())));
	};

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
		validatorsRef,
		setMounted,
		isReadonly,
		validate: validateFields,
	};
};

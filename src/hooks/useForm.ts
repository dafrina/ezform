import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {EzformConfig} from "../config";

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
	setFields: Dispatch<SetStateAction<FieldValues>>;
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
}

export interface FormConfig {
	onSubmit: (values: FieldValues) => void;
	initialState?: FieldValues;
	formatMessage?: FormatMessageType;
	submitUnmountedFields?: boolean;
}

const set = (obj: any, path: any, val: any) => {
	const keys = path.split(".");
	const lastKey = keys.pop();
	const lastObj = keys.reduce((obj: any, key: any) => obj[key] = obj[key] || {}, obj);
	lastObj[lastKey] = val;
};

const flatten: (obj: any, roots?: any[], sep?: string) => any & { [p: string]: any } = (obj: any, roots = [], sep = ".") => Object.keys(obj).reduce((memo, prop) => Object.assign({}, memo, Object.prototype.toString.call(obj[prop]) === "[object Object]" ? flatten(obj[prop], roots.concat([prop])) : {[roots.concat([prop]).join(sep)]: obj[prop]}), {});

export const useForm = (props: FormConfig): FormRefObject => {

	const {onSubmit, initialState, formatMessage, submitUnmountedFields} = {...EzformConfig(), ...props};

	const [fields, setFields] = useState(flatten(initialState) as FieldValues);
	const [mounted, setMounted] = useState({} as MountedValues);
	const [errors, setErrors] = useState({} as ErrorValues);
	const [validators, setValidators] = useState({} as ValidatorValues);
	const validatorsRef = useRef(validators);
	validatorsRef.current = validators;

	useEffect(() => {
		if (initialState) {
			setFields((prevState: FieldValues) => (Object.assign(prevState, flatten(initialState))));
		}
	}, [initialState]);

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
				if (fields[k]) {
					if (submitUnmountedFields || mounted[k]) {
						set(values, k, fields[k]);
					}
				}
			});

			onSubmit(values);
		} else {
			console.log("The form contains errors. Form was not submitted");
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
			const validatorResult = validator(value, formatMessage);

			setErrors((prev) => ({ ...prev, [name]: validatorResult }));
		}
	};

	const getNestedState = (state: any) => () => {
		const values = {};

		Object.keys(state).forEach((k) => {
			if (state[k]) {
				set(values, k, state[k]);
			}
		});

		return values;
	};

	return {
		getFields: getNestedState(fields),
		setFields,
		getField,
		setField,
		getErrors: getNestedState(errors),
		setErrors,
		hasError,
		hasErrors,
		submit,
		reset,
		getHelperText,
		formatMessage,
		getValidators: getNestedState(validators),
		setValidators,
		setMounted,
	};
};

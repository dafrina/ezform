import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { EzformConfig } from "../config";
import { deepSet, flatten, unflatten } from "../utils";

export type FieldType = any | null;
export type MountedType = boolean | null;
export type ErrorType = string | null;
export type ValidatorType = ((
	value: FieldType,
	fields: FieldValues,
	formatMessage?: any
) => string | null) | null;

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
	setFields: Dispatch<SetStateAction<any>>;
	getField: (name: string) => FieldType;
	setField: (
		name: string,
		value: FieldType,
		validateImmediately?: boolean
	) => void;
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

export interface IFormRefObject<T> extends FormRefObject {
	setFields: Dispatch<SetStateAction<Partial<T>>>;
}

export interface FormConfig {
	onSubmit: (values: any) => void;
	initialState?: any;
	formatMessage?: any;
	submitUnmountedFields?: boolean;
	isReadonly?: boolean;
	logging?: {
		warnOnErrors: boolean;
		logFields: boolean;
	};
}

export interface IFormConfig<T> extends FormConfig {
	onSubmit: (values: Partial<T>) => void;
	initialState?: Partial<T>;
}


export const useForm = <T>(props: IFormConfig<T>): IFormRefObject<T> => {
	const {
		onSubmit,
		initialState,
		formatMessage,
		submitUnmountedFields,
		isReadonly,
		logging
	}: IFormConfig<T> = { ...EzformConfig(), ...props };

	const [fields, setFields] = useState<FieldValues>(flatten(initialState));
	const [mounted, setMounted] = useState<MountedValues>({});
	const [errors, setErrors] = useState<ErrorValues>({});
	const validatorsRef = useRef<ValidatorValues>({});
	const fieldsRef = useRef(fields);
	const mountedRef = useRef(mounted);
	const errorsRef = useRef(errors);
	fieldsRef.current = fields;
	mountedRef.current = mounted;
	errorsRef.current = errors;

	useEffect(() => {
		if (initialState) {
			setFields((prevState: FieldValues) =>
				Object.assign(prevState, flatten(initialState))
			);
		}
	}, [initialState]);

	const hasError = (name: string) => {
		return !!errors[name];
	};

	const hasErrors = () => {
		return Object.values(errorsRef.current)
			.map((e) => !!e)
			.filter((b) => b)
			.length > 0;
	};

	const getHelperText = (name: string) => {
		if (errors[name]) {
			return errors[name];
		}
		return null;
	};

	const validateFields = () => {
		const result =
			Object.keys(mountedRef.current)
				.map((v) => {
					if (validatorsRef.current[v]) {
						const value = fieldsRef.current?.[v];
						const validatorResult = validatorsRef.current[v](
							value,
							fieldsRef.current,
							formatMessage
						);
						errorsRef.current = { ...errorsRef.current, [v]: validatorResult };
						return validatorResult;
					} else {
						errorsRef.current = { ...errorsRef.current, [v]: null };
						return null;
					}
				})
				.filter((v) => v).length > 0;

		setErrors(errorsRef.current);
		return result;
	};

	const submit = (validate = true) => {
		if (logging?.logFields) {
			console.log("Form fields", unflatten(fieldsRef.current));
		}

		if (isReadonly) {
			if (logging?.logFields) {
				console.warn("Submission is not allowed on readonly forms!");
			}
			return;
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
			if (logging?.warnOnErrors) {
				console.warn(
					"Form not submitted. The form contains errors:\n\n" +
					Object.keys(errorsRef.current)
						.filter((e) => !!errorsRef.current[e])
						.map((e) => `${e.padEnd(20)} ${errorsRef.current[e]}`)
						.join("\n")
				);
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

	const setField = (
		name: string,
		value: FieldType,
		validateImmediately = true
	) => {
		setFields((prev) => ({ ...prev, [name]: value }));

		const validator = validatorsRef.current[name];

		if (validateImmediately && validator) {
			const validatorResult = validator(
				value,
				fieldsRef.current,
				formatMessage
			);

			setErrors((prev) => ({ ...prev, [name]: validatorResult }));
		}
	};

	const fieldsSetter = (value: SetStateAction<Partial<T>>) => {
		if (value instanceof Function) {
			setFields((prevState) => flatten(value(unflatten(prevState) as Partial<T>)));
		} else {
			setFields(flatten(value));
		}
	};

	return {
		getFields: () => unflatten(fieldsRef.current),
		setFields: fieldsSetter,
		getField,
		setField,
		getErrors: () => unflatten(errorsRef.current),
		setErrors,
		hasError,
		hasErrors,
		submit,
		reset,
		getHelperText,
		formatMessage,
		validatorsRef,
		setMounted,
		isReadonly: isReadonly || false,
		validate: validateFields
	};
};

import {Dispatch, RefObject, SetStateAction} from "react";

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

import { useEffect } from "react";
import {FieldType, FormRefObject, ValidatorType} from "./useForm";

export const useField = (name: string, validator: ValidatorType, form: FormRefObject, defaultValue?: FieldType) => {
	const hasDefaultValue = defaultValue !== null && typeof defaultValue !== "undefined";

	useEffect(() => {
		form.validatorsRef.current[name] = validator;
	}, [validator]);

	useEffect(() => {
		form.setMounted((prev) => ({ ...prev, [name]: true }));

		if (hasDefaultValue) form.setField(name, defaultValue, false);

		return () => {
			form.validatorsRef.current[name] = null;
			form.setErrors((prev) => ({ ...prev, [name]: null }));
			form.setMounted((prev) => ({ ...prev, [name]: false }));
		};
	}, []);
};

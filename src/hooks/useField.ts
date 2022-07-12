import { useEffect } from "react";
import { FormRefObject } from "./useForm";

export const useField = (name: string, validator: (value: string) => string | null, form: FormRefObject, defaultValue?: any) => {
	const hasDefaultValue = defaultValue !== null && typeof defaultValue !== "undefined";

	useEffect(() => {
		form.setValidators((prev) => ({ ...prev, [name]: validator }));
		form.setMounted((prev) => ({ ...prev, [name]: true }));

		if (hasDefaultValue) form.setField(name, defaultValue, false);

		return () => {
			form.setValidators((prev) => ({ ...prev, [name]: null }));
			form.setErrors((prev) => ({ ...prev, [name]: null }));
			form.setMounted((prev) => ({ ...prev, [name]: false }));

			if (hasDefaultValue) form.setField(name, null, false);
		};
	}, []);
};

import { useEffect } from "react";
import { FormRefObject } from "./useForm";

export const useField = (name: string, validator: (value: string) => string | null, form: FormRefObject) => {
	useEffect(() => {
		form.setValidators((prev) => ({ ...prev, [name]: validator }));
		form.setMounted((prev) => ({ ...prev, [name]: true }));

		return () => {
			form.setValidators((prev) => ({ ...prev, [name]: null }));
			form.setErrors((prev) => ({ ...prev, [name]: null }));
			form.setMounted((prev) => ({ ...prev, [name]: false }));
		};
	}, []);
};

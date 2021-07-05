import { useEffect } from "react";
import { FormRefObject } from "./useForm";

export const useValidator = (name: string, validator: (value: string) => string | null, form: FormRefObject) => {
	useEffect(() => {
		form.setValidators((prev) => ({ ...prev, [name]: validator }));

		return () => {
			form.setValidators((prev) => ({ ...prev, [name]: null }));
		};
	}, []);
};

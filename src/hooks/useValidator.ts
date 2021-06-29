import { useEffect } from "react";

const useValidator = (name, validator, form) => {
	useEffect(() => {
		form.setValidators((prev) => ({ ...prev, [name]: validator }));

		return () => {
			form.setValidators((prev) => ({ ...prev, [name]: null }));
		};
	}, []);
};

export default useValidator;

import React from "react";
import {FieldBaseProps} from "./FieldBase";
import useValidator from "../hooks/useValidator";
import { FormControl, FormControlLabel, Checkbox, FormHelperText } from "@material-ui/core";

const FieldCheckbox = (props: FieldBaseProps) => {
	const { id, name, form, validator = () => null, disabled, label } = props;

	useValidator(name, validator, form);

	const handleChange = (e, value) => {
		form.handleChange(name, value, validator);
	};

	return (
		<FormControl error={form.hasError(name)}>
			<FormControlLabel
				control={
					<Checkbox
						id={id}
						disabled={disabled}
						checked={form.fields?.[name] || false}
						value={form.fields?.[name] || ""}
						onChange={handleChange}
						name={name}
						color="primary"
					/>
				}
				label={label}
			/>
			{form.hasError(name) && <FormHelperText error>{form.getHelperText(name)}</FormHelperText>}
		</FormControl>
	);
};

export default FieldCheckbox;

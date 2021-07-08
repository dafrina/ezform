import React from "react";
import { FieldBaseProps } from "./FieldBase";
import { useValidator } from "../hooks";
import { FormControl, FormControlLabel, Checkbox, FormHelperText } from "@material-ui/core";

interface FieldCheckboxProps extends FieldBaseProps {
	color?: "default" | "primary" | "secondary";
}

export const FieldCheckbox = (props: FieldCheckboxProps) => {
	const { id, name, form, validator = () => null, disabled, label, color = "secondary" } = props;

	useValidator(name, validator, form);

	const handleChange = (e, value) => {
		form.setField(name, value);
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
						color={color}
					/>
				}
				label={label}
			/>
			{form.hasError(name) && <FormHelperText error>{form.getHelperText(name)}</FormHelperText>}
		</FormControl>
	);
};

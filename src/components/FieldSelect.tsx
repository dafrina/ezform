import React from "react";
import { FieldBaseProps } from "./FieldBase";
import { useValidator } from "../hooks";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@material-ui/core";

interface FieldSelectProps extends FieldBaseProps {
	options: { key: string; value: string; label: string; disabled?: boolean }[];
	variant?: "filled" | "outlined" | "standard";
}

export const FieldSelect = (props: FieldSelectProps) => {
	const { id, name, form, validator = () => null, disabled, label, options, variant = "standard" } = props;

	useValidator(name, validator, form);

	const handleChange = (e) => {
		form.setField(name, e.target.value);
	};

	return (
		<FormControl fullWidth>
			<InputLabel id={`${id}-label`}>{label}</InputLabel>
			<Select
				variant={variant}
				labelId={`${id}-label`}
				id={id}
				value={form.fields?.[name] || ""}
				onChange={handleChange}
				disabled={disabled}
				error={form.hasError(name)}
				autoWidth
				fullWidth
			>
				{options.map((option) => (
					<MenuItem key={option.key} value={option.value} disabled={option?.disabled || false}>
						{option.label}
					</MenuItem>
				))}
			</Select>
			{form.hasError(name) && <FormHelperText error>{form.getHelperText(name)}</FormHelperText>}
		</FormControl>
	);
};

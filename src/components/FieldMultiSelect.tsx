import React from "react";
import { FieldBaseProps } from "./FieldBase";
import { useValidator } from "../hooks";
import {
	MenuItem,
	ListItemText,
	Checkbox,
	TextField
} from "@material-ui/core";

interface FieldMultiSelectProps extends FieldBaseProps {
	options: { key: string; value: string; label: string; disabled?: boolean }[];
	variant?: "filled" | "outlined" | "standard";
}

export const FieldMultiSelect = (props: FieldMultiSelectProps) => {
	const { id, name, form, validator = () => null, disabled, label, options, variant = "standard" } = props;

	useValidator(name, validator, form);

	const handleChange = (e) => {
		form.setField(name, e.target.value);
	};

	return (
		<TextField
			select
			label={label}
			variant={variant}
			id={id}
			value={form.fields?.[name] || []}
			onChange={handleChange}
			disabled={disabled}
			error={form.hasError(name)}
			SelectProps={{
				multiple: true,
				renderValue: (selected: any) => selected?.join(", ")
			}}
			fullWidth
			helperText={form.getHelperText(name)}
		>
			{options.map((option) => (
				<MenuItem key={option.key} value={option.value} disabled={option?.disabled || false}>
					<Checkbox checked={form.fields?.[name]?.indexOf(option.value) > -1} color="primary" />
					<ListItemText primary={option.label} />
				</MenuItem>
			))}
		</TextField>
	);
};
import React from "react";
import {FieldBaseProps} from "./FieldBase";
import useValidator from "../hooks/useValidator";
import { TextField } from "@material-ui/core";

interface FieldTextProps extends FieldBaseProps {
	multiline?: boolean;
}

const FieldText = (props: FieldTextProps) => {
	const { id, name, form, validator = () => null, disabled, label, multiline = false } = props;

	useValidator(name, validator, form);

	const handleChange = (e) => {
		form.handleChange(name, e.target.value, validator);
	};

	return (
		<TextField
			variant="outlined"
			name={name}
			id={id}
			label={label}
			onChange={handleChange}
			value={form.fields?.[name] || ""}
			disabled={disabled}
			error={form.hasError(name)}
			helperText={form.getHelperText(name)}
			multiline={multiline}
		/>
	);
};

export default FieldText;

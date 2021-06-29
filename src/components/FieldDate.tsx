import React from "react";
import {FieldBaseProps} from "./FieldBase";
import useValidator from "../hooks/useValidator";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

interface FieldDateProps extends FieldBaseProps {
	format: string;
}

const FieldDate = (props: FieldDateProps) => {
	const { id, name, form, validator = () => null, disabled, label, format } = props;

	useValidator(name, validator, form);

	const handleChange = (value) => {
		form.handleChange(name, value, validator);
	};

	return (
		<MuiPickersUtilsProvider utils={MomentUtils}>
			<KeyboardDatePicker
				disableToolbar
				disabled={disabled}
				format={format}
				margin="normal"
				name={name}
				id={id}
				label={label}
				value={form.fields?.[name] || ""}
				onChange={handleChange}
				KeyboardButtonProps={{
					"aria-label": "change date",
				}}
				error={form.hasError(name)}
				helperText={form.getHelperText(name)}
				autoOk
				inputVariant="outlined"
			/>
		</MuiPickersUtilsProvider>
	);
};

export default FieldDate;

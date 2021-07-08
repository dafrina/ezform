import React, {ReactNode} from "react";
import { FieldBaseProps } from "./FieldBase";
import { useValidator } from "../hooks";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {FormControl} from "@material-ui/core";
import {Moment} from "moment";

interface FieldDateProps extends FieldBaseProps {
	format: string;
	autoOk?: boolean;
	variant?: "filled" | "outlined" | "standard";
	minDate?: ParsableDate;
	minDateMessage?: ReactNode;
	maxDate?: ParsableDate;
	maxDateMessage?: ReactNode;
	views?: Array<"year" | "date" | "month" | "hours" | "minutes">;
	disablePast?: boolean;
	disableFuture?: boolean;
}

export const FieldDate = (props: FieldDateProps) => {
	const { id, name, form, validator = () => null, disabled, label, format, autoOk = true, variant = "standard", minDate, maxDate, minDateMessage, maxDateMessage, disablePast, disableFuture, views } = props;

	useValidator(name, validator, form);

	const handleChange = (value: any) => {
		form.handleChange(name, value.valueOf(), validator);
	};

	return (
		<FormControl fullWidth>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<KeyboardDateTimePicker
					autoOk={autoOk}
					disableToolbar
					disabled={disabled}
					format={format}
					margin="normal"
					name={name}
					id={id}
					label={label}
					value={form.fields?.[name] || new Date().getTime()}
					onChange={handleChange}
					KeyboardButtonProps={{
						"aria-label": "change date",
					}}
					error={form.hasError(name)}
					helperText={form.getHelperText(name)}
					inputVariant={variant}
					minDate={minDate}
					minDateMessage={minDateMessage}
					maxDate={maxDate}
					maxDateMessage={maxDateMessage}
					disablePast={disablePast}
					disableFuture={disableFuture}
					views={views}
					ampm={false}
				/>
			</MuiPickersUtilsProvider>
		</FormControl>
	);
};

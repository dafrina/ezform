import React, {ReactNode} from "react";
import { FieldBaseProps } from "./FieldBase";
import { useValidator } from "../hooks";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {FormControl} from "@material-ui/core";

interface FieldDateProps extends FieldBaseProps {
	format: string;
	autoOk?: boolean;
	variant?: "filled" | "outlined" | "standard";
	minDate?: ParsableDate;
	minDateMessage?: ReactNode;
	maxDate?: ParsableDate;
	maxDateMessage?: ReactNode;
	initialDate?: ParsableDate;
	views?: Array<"year" | "date" | "month" | "hours" | "minutes">;
	disablePast?: boolean;
	disableFuture?: boolean;
}

export const FieldDate = (props: FieldDateProps) => {
	const { id, name, form, validator = () => null, disabled, label, format, autoOk = true, variant = "standard", minDate, maxDate, minDateMessage, maxDateMessage, initialDate, disablePast, disableFuture, views } = props;

	useValidator(name, validator, form);

	const handleChange = (date: any) => {
		form.setField(name, date?.unix() * 1000);
	};

	return (
		<FormControl fullWidth>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<KeyboardDateTimePicker
					autoOk={autoOk}
					disableToolbar
					disabled={disabled}
					format={format}
					name={name}
					id={id}
					label={label}
					value={form.fields?.[name]}
					onChange={handleChange}
					KeyboardButtonProps={{
						"aria-label": "change date",
					}}
					error={form.hasError(name)}
					helperText={form.getHelperText(name)}
					inputVariant={variant}
					initialFocusedDate={initialDate}
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

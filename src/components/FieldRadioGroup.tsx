import React from "react";
import {FieldBaseProps} from "./FieldBase";
import useValidator from "../hooks/useValidator";
import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio, FormHelperText } from "@material-ui/core";

interface FieldRadioGroupProps extends FieldBaseProps {
	options?: { key: string; value: string; label: string; disabled?: boolean }[];
}

const FieldRadioGroup = (props: FieldRadioGroupProps) => {
	const { id, name, form, validator = () => null, label, options } = props;

	useValidator(name, validator, form);

	const handleChange = (e, value) => {
		form.handleChange(name, value, validator);
	};

	return (
		<FormControl error={form.hasError(name)} component="fieldset">
			{label && <FormLabel component="legend">{label}</FormLabel>}
			<RadioGroup id={id} value={form.fields?.[name] || null} onChange={handleChange}>
				{options.map((option) => (
					<FormControlLabel
						key={option.key}
						value={option.value}
						control={<Radio />}
						label={option.label}
						disabled={option?.disabled || false}
					/>
				))}
			</RadioGroup>
			{form.hasError(name) && <FormHelperText error>{form.getHelperText(name)}</FormHelperText>}
		</FormControl>
	);
};

export default FieldRadioGroup;

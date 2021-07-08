import React from "react";
import { FieldBaseProps } from "./FieldBase";
import { useValidator } from "../hooks";
import { FormControl, FormControlLabel, FormLabel, FormGroup, Checkbox, FormHelperText } from "@material-ui/core";

interface FieldCheckboxGroupProps extends FieldBaseProps {
	options: { key: string; value: string; label: string; disabled?: boolean }[];
	color?: "default" | "primary" | "secondary";
}

export const FieldCheckboxGroup = (props: FieldCheckboxGroupProps) => {
	const { id, name, form, validator = () => null, label, options, color = "secondary" } = props;

	useValidator(name, validator, form);

	const handleChange = (option) => () => {
		const newList = form.fields[name] || [];

		const selected = form.fields?.[name]?.find((obj) => {
			return obj.key === option.key;
		});

		if (newList.length <= 0 || !selected) {
			newList.push({ ...option });
		} else {
			newList.splice(
				newList.findIndex((o) => o.key === option.key),
				1,
			);
		}

		form.setField(name, newList);
	};

	return (
		<FormControl error={form.hasError(name)} component="fieldset">
			{label && <FormLabel component="legend">{label}</FormLabel>}
			<FormGroup id={id}>
				{options.map((option, i) => {
					const selected = form.fields?.[name]?.find((obj) => {
						return obj.key === option.key;
					});

					return (
						<FormControlLabel
							key={option.key}
							control={
								<Checkbox
									disabled={option?.disabled || false}
									checked={!!selected || false}
									value={option.value}
									onChange={handleChange(option)}
									name={`${name}-key-${i}`}
									color={color}
								/>
							}
							label={option.label}
						/>
					);
				})}
			</FormGroup>
			{form.hasError(name) && <FormHelperText error>{form.getHelperText(name)}</FormHelperText>}
		</FormControl>
	);
};

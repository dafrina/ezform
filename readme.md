# EZForm is an easy form and field-level validation library for react

## Build Project

````
npm install -g typescript; npm install; npm run build;
````

## Demo

You can find a working demo using [@ezform/mui](https://github.com/dafrina/ezform-mui):

(https://codesandbox.io/s/adoring-dewdney-7o9f9)

## Install

````
npm i @ezform/core --save
````

(https://www.npmjs.com/package/@ezform/core)

## How it works

EZForm's core mechanic relies on hooks. Each `Field` component registers its validator to the form object created by the `useForm` hook. This process takes place after the component has been mounted. In turn, when the component is unmounted, it automatically unregisters itself from the form. This means you can dynamically add and remove form fields and have more complex structured forms, without having to know how all fields look like in the form.

When a `Field`s value changes, it will update the `field` state provided by the hook and validate that single field. If an error occurs, the error message will be stored in the `errors` state provided by the hook.

The aim of this project was to make a powerful validation library that not only works well, but also is extremely easy to use with as little setup as possible required. And EZ indeed it is!

## Usage

First we need to tell the program that we want to build a form, and what happens when we submit said form. The form will only be submitted if no currently mounted fields fail validation. We can set initial data to prefill our form and we can pass a function as `formatMessage`, which can be used to translate the error message from the validators. You can also specify that only mounted fields should be submitted. By default, all fields get submitted. If you want to only get the values for form fields that are mounted, you can override it by setting `submitUnmountedFields` to false. This can be useful if you're building a multi-step form or when you want to include form fields in your initialState without having actual inputs for example.


````
interface FormConfig {
    onSubmit: (values: any) => void;
    initialState?: any;
    formatMessage?: (messageKey: string) => string;
    submitUnmountedFields?: boolean;
}

useForm(config: FormConfig);
````

For example:

````
const ezform = useForm({
    onSubmit: (values) => {
        console.log("Form got submitted. Form values:", values);
    },
    initialState: {
        firstName: "Johnny",
        lastName: "Silverhand",
        nested: {
            objects: "Yes thats possible now!"
        }
    },
    formatMessage: (messageKey) => translate(messageKey)
});
````

The `useForm` hook returns a `FormRefObject` which contains the following properties/methods:

- getFields: (object containing all form fields with its values, returns a nested object)
- setFields: (default setter function for the form fields state)
- setField: (name: string, value: any, validateImmediately?: boolean (default true))
- getField: (name: string)
- getErrors: (object containing all form fields with its error messages or null, returns a nested object)
- setErrors: (default setter function for the form errors state)
- hasError: (fieldName: string) => boolean
- getValidators: (object containing all currently registered validators, returns a nested object);
- setValidators: (default setter function for the validators state)
- submit: () => void (validates all form fields and calls the onSubmit function passed to the useForm hook)
- reset: () => void (clears all form fields and resets the errors)
- getHelperText: (fieldName: string) => string
- formatMessage?: (messageKey: string) => string;

You can also define a global configuration for all forms in your application:

````
import EzformConfig from "@ezform/core";

// set config globally
EzformConfig({
    submitUnmountedFields: false
});

// get global config
const config = EzformConfig();
````

> The global settings can be overridden in the config for each individual form.

Now lets get to the interesting part! We can now build our form however we like it, without wrapper components or any other setup but the useForm hook and form components.

> Please note: the examples shown use @ezform/mui form components. [Click here](https://github.com/dafrina/ezform-mui) to use ezform with the Material UI form components.

````
<FieldText id="firstName" name="firstName" form={ezform} validator={requiredValidator} label="Please enter your first name" />
<FieldText id="lastName" name="lastName" form={ezform} validator={requiredValidator} label="Dont forget your last name" />
````

And in order to submit the form simply use the submit function from our ezform object:

````
<button onClick={ezform.submit}>Submit</button>
````

You can use dots to nest your submitted values.

For example `<FieldText name="this.path.is.nested.firstName" ... />` will pass an object to the onSubmit config function with the value of firstName stored in `values["this"]["path"]["is"]["nested"]["firstName"]`.

For simplicity, all values get stored in a flat object internally. When calling `ezform.getFields()`, `ezform.getErrors()` or `ezform.getValidators()` however, you will conveniently get a nested object as well. Keep in mind that you still have to pass the field names as a single string with the full path seperated by dots for other getters and setters:

````
// set one field directly
ezform.setField("this.path.is.nested.firstName", "John");

// set field with access to the previous state
ezform.setFields((previousFields) => {
    return { ...previousFields, "this.path.is.nested.firstName": "John" }
}

// get a field value
ezform.getField("this.path.is.nested.firstName");

// check if a the field has an error
ezform.hasError("this.path.is.nested.firstName");
````

## Validators

EZForm works with pure functions as validators and each `Field` component can take an optional `validator` prop. The function takes one argument which is the `value` that the field holds.  The only requirement for this function is, that it returns a `string` with an error message in case the input failed the validation, or `null` when the validation was successful.

This means you can pass any function that follows these requirements:

````
const customValidator = (value: any) => {
    if (value === "SomeCondition") {
        return "This is your error text!";
    }
    return null;
}
````

If you configured `useForm` for use with translations, your validator can also accept a second parameter:

````
const customValidatorWithTranslation = (value: any, formatMessage?: (messageKey: string) => string) => {
    if (value === "SomeCondition") {
        return formatMessage ? formatMessage("translation_key") : "Fallback error text!";
    }
    return null;
}
````

However, EZForm already comes with some basic validator functions that are ready to use:

### requiredValidator

Checks if a field has a null value or an empty string value

### requiredListValidator

Checks if an array (such as the value of a checkbox group or multiselect) is empty

### numberValidator

Checks if a fields value is a number

### emailValidator

Checks if an email is formed correctly

### urlValidator

Checks if an URL is formed correctly

### dateValidator

Checks if a date was entered correctly

### fileValidator

Checks if a file was selected on a `FieldFile` ([@ezform/mui](https://github.com/dafrina/ezform-mui)) component. Please note that this validator only checks if a file is selected, but not if the filetype or size is invalid. You need to implement your own validator to handle these cases.

### combinedValidator

This function can be used to combine multiple validators. They will be checked in the order from first to last in the array.

Usage:
````
<FieldText label="First name" name="firstName" form={ezform} validator={combinedValidator([requiredValidator, urlValidator])} />
````


## Creating your own Fields

You may want to integrate EZForm into your project without having to use [@ezform/mui](https://github.com/dafrina/ezform-mui) form components. 

All EZForm needs to work, is for your component to:

- accept a `name`, `form` and `validator` prop
- call the `useField` hook and pass the `name`, `validator` and `form` as function arguments
- implement a `handleChange` function which modifies the form field when the value changes. You are free on how you do it, but make sure to call `form.setField(name, value, validateImmediately);`. Notice that you need to pass the `name` prop to let EZForm know which field you are changing as well as the `value` of the form field. You can optionally instruct EZForm to validate the field after a change. If you don't pass the `validateImmediately` argument, it will default to `true`.

EZForm uses this technique internally to integrate Material UI's form fields. The great thing is, you may also call the `setField` method from anywhere you have a reference to the `ezform` object, which means you can alter the form after asynchronous data has been loaded.

Take a look at the `FieldText` source from `@ezform/mui` for an easy example:

````
export const FieldText = (props: FieldTextProps) => {
	const { id, name, form, validator = () => null, disabled, label, multiline = false, variant = "standard", color = "primary", placeholder } = props;

	useField(name, validator, form);

	const handleChange = (e) => {
		form.setField(name, e.target.value);
	};

	return (
		<TextField
			variant={variant}
			color={color}
			name={name}
			id={id}
			label={label}
			onChange={handleChange}
			value={form.fields?.[name] || ""}
			disabled={disabled}
			error={form.hasError(name)}
			helperText={form.getHelperText(name)}
			multiline={multiline}
			placeholder={placeholder}
			fullWidth
		/>
	);
};
````

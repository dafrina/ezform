# EZForm is an easy form and field-level validation library for react using Material UI components

## Build Project

````
npm install -g typescript; npm install; tsc;
````

## How it works

EZForm core mechanic relies on hooks. Each `Field` component registers its validator to the form object created by the `useForm` hook. This process takes places after the component has been mounted. In turn, when the component is unmounted, it automatically unregisters itself from the form. This means you can dynamically add and remove form fields and have more complex structured forms, without having to know how all fields look like in the form.

When a `Field`s value changes, it will update the `field` state provided by the hook and validate that single field. If an error occurs, the error message will be stored in the `errors` state provided by the hook.

The aim of this project was to make a powerful validation library that not only works well, but also is extremely easy to use with as little setup as possible required. And EZ indeed it is!

## Usage

First we need to tell the program that we want to build a form, and what happens when we submit said form. The form will only be submitted if no currently mounted fields fail validation. We can also set initial data to prefill our form.


````
useForm(onSubmit: (values: any) => void, initialData?: any)
````

For example:

````
const ezform = useForm(
    (values) => {
        console.log("Form got submitted. Form values:", values);
    },
    {
        firstName: "Johnny",
        lastName: "Silverhand"
    },
);
````

The `useForm` hook returns an object which contains the following properties/methods:

- fields: (object containing all form fields with its values)
- setFields: (default setter function for the form fields state)
- errors: (object containing all form fields with its error messages or null)
- setValidators: (default setter function for the validators state)
- handleChange: (name: string, value: any, validator?: (value: string) => string | null)
- submit: () => void (validates all form fields and calls the onSubmit function passed to the useForm hook)
- hasError: (fieldName: string) => boolean
- getHelperText: (fieldName: string) => string

Now lets get to the interesting part! We can now build our form however we like it, without wrapper components or any other setup but the useForm hook.

````
<FieldText id="firstName" name="firstName" form={ezform} validator={defaultValidators.required} label="Please enter your first name" />
<FieldText id="lastName" name="lastName" form={ezform} validator={defaultValidators.required} label="Dont forget your last name" />
````

And in order to submit the form simply use the submit function from our ezform object:

````
<button onClick={ezform.submit}>Submit</button>
````



## Validators

EZForm works with pure functions as validators and each `Field` component can take an optional `validator` prop. The function takes one argument which is the `value` that the field holds.  The only requirement for this function is, that it returns a `string` with an error message in case the input failed the validation, or `null` when the validation was successful.

This means you can pass any function that follows these requirements:

````
const onlyAllowVegans = (value: any) => {
    if (value === "I like meat!") {
        return "Sorry, we only allow vegans here!";
    }
    return null;
}
````

However, EZForm already comes with some basic validator functions that are ready to use:

### requiredValidator

Checks if a field has a null value or an empty string value

### requiredListValidator

Checks if an array (such as a checkbox group or multiselect) is empty

### numberValidator

Checks if a fields value is a number

### emailValidator

Checks if an email is formed correctly

### urlValidator

Checks if a URL is formed correctly

Currently, you can only pass one validator function to a `Field` component. If you wish to combine validators, you can simply make a new validator function and call the default validators (or custom ones!) yourself to mix and match.

## Components

Currently, EZForm comes with a the most basic form fields based on Material UI form fields. It is, however, very easy to create your own components to use. Read more about it under "Creating your own Fields". Also, I plan to add more and more customization options and new form components over time.

### FieldBase interface

This interface acts as a base for all field properties. All form components described below can take the following properties:

- name: string;
- form: any;
- id: string;
- validator?: (value: any) => string | null;
- disabled?: boolean;
- label?: string;

### FieldText

Basic text input

- multiline?: boolean

### FieldSelect

Select dropdown

- options?: { key: string; value: string; label: string; disabled?: boolean }[];

### FieldDate

Materials KeyboardDatePicker input

- format: string;

### FieldCheckbox

Single checkbox

### FieldCheckboxGroup

Multiple checkboxes under the same field name

- options?: { key: string; value: string; label: string; disabled?: boolean }[];

### FieldRadioGroup

Multiple radio inputs under the same field name

- options?: { key: string; value: string; label: string; disabled?: boolean }[];

## Creating your own Fields

You may want to integrate EZForm into your project without having to use Material UI's form components. 

All EZForm needs to work, is for your component to:

- accept a `name`, `form` and `validator` prop
- call the `useValidator` hook and pass the `name`, `validator` and `form` as function arguments
- implement a `handleChange` function which modifies the form field when the value changes. You are free on how you do it, but make sure to call `form.handleChange(name, value, validator);`. Notice that you need to pass the `name` and `validator` props to let EZForm know which field you are changing as well as the `value` to which you want you data to be saved.

EZForm uses this technique internally to integrate Material UI's form fields. Take a look at the `FieldText` source for an easy example:

````
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
			value={form.fields?.[name] || ''}
			disabled={disabled}
			error={form.hasError(name)}
			helperText={form.getHelperText(name)}
			multiline={multiline}
		/>
	);
};
````

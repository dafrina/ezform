# EZForm is an easy form and field-level validation library for react

## Build Project

````
npm install -g typescript; npm install; npm run build;
````

## Demo

You can find a working demo using [@ezform/mui](https://github.com/dafrina/ezform-mui):

(https://codesandbox.io/s/restless-shape-7rjl6)

## Install

````
npm i @ezform/core --save
````

(https://www.npmjs.com/package/@ezform/core)

## Features

- Lightweight (10.9kb gzipped) and zero dependencies
- Easy to use (intuitive usage, field level validation/no schematics)
- Flexible (hooks based, no form wrapper)
- Easy to extend (custom fields, custom validators)
- Good performance (only necessary rerenders)
- Multilingual support

## How it works

Each `Field` component registers its validator to the form object created by the `useForm` hook. This process takes place after the component has been mounted. In turn, when the component is unmounted, it automatically unregisters itself from the form. This means you can dynamically add and remove form fields and have more complex structured forms, without having to know how all fields look like in the form.

The aim of this project was to make a powerful validation library that is flexible and easy to use without sacrificing functionality.

## Usage

For example:

````
const ezform = useForm({
    onSubmit: (values) => {
        console.log("Form got submitted. Form values:", values);
    },
    initialState: {
        firstName: "Johnny",
        lastName: "Silverhand",
        address: {
            city: "New York",
            country: "United States"
        }
    },
    formatMessage: (messageKey) => translate(messageKey),
    submitUnmountedFields: false,
    isReadonly: false
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
- isReadonly?: boolean (indicates if the form is readonly)

> Please note: the examples shown use @ezform/mui form components. [Click here](https://github.com/dafrina/ezform-mui) to use ezform with the Material UI form components.

````
<FieldText name="firstName" form={ezform} validator={requiredValidator} />
<FieldText name="lastName" form={ezform} validator={requiredValidator} />
<FieldText name="address.city" form={ezform} validator={requiredValidator} />
<FieldText name="address.country" form={ezform} validator={requiredValidator} />
````

You can create fully dynamic forms. Specify an object path to define fields:

````
// Map this fields value to 'firstName' property of first client
<FieldText name="clients[0].firstName" form={ezform} validator={requiredValidator} />

// or map 5 fields iteratively
{ Array(5).fill().map((num, index) => (
    <FieldText name={"clients[" + index + "].firstName"} form={ezform} validator={requiredValidator} />
))}
````

In order to submit the form, call the submit function returned by the hook:

````
<button onClick={ezform.submit}>Submit</button>
````

## Global Config
You can define a global configuration for all forms in your application:

````
import { EzformConfig } from "@ezform/core";

// set config globally
EzformConfig({
    formatMessage: myGlobalTranslateFunction,
    submitUnmountedFields: false,
    logging: {
        warnOnErrors: false,
        logFields: false,
    }
});

// get global config
const config = EzformConfig();
````

The global config can be overridden in the config for each individual form.

## Validators

EZForm works with pure functions as validators and each `Field` component can take an optional `validator` prop. The function takes one argument which is the `value` that the field holds. The only requirement for this function is, that it returns a `string` with an error message in case the input failed the validation, or `null` when the validation was successful.

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
<FieldText validator={combinedValidator([requiredValidator, urlValidator])} ... />
````


## Creating your own Fields

You may want to integrate EZForm into your project without having to use [@ezform/mui](https://github.com/dafrina/ezform-mui) form components. 

All EZForm needs to work, is for your component to:

- accept a `name`, `form` and `validator` prop
- call the `useField` hook and pass the `name`, `validator` and `form` as function arguments
- implement a `handleChange` function which modifies the form field by calling `ezform.setField(name, value, validateImmediately);`. Notice that you need to pass the `name` prop to let EZForm know which field you are changing as well as the `value` of the form field. You can optionally instruct EZForm to validate the field after a change. If you don't pass the `validateImmediately` argument, it will default to `true`.

Here is a minimal example on how to create your own text input with validation ability:

````
import { useField } from "@ezform/core";

const CustomInputComponent = (props) => {
  const { name, form, validator = () => null } = props;

  // always call this first to register the component to the form
  useField(name, validator, form);

  const handleChange = (e) => {
    form.setField(name, e.target.value);
  };

  return (
    <input
      type="text"
      onChange={handleChange}
      name={name}
      style={form.hasError(name) ? { background: "red" } : {}}
    />
  );
};

...

<CustomInputComponent name="myfield" form={myform} validator={requiredValidator} />
````

In order to minimize rerenders, use Reacts `memo` and the `propsEqual` function that EZForm provides:

````
import React, { memo } from "react";
import { propsEqual } from "@ezform/core";

const CustomInputComponentMemo = memo(CustomInputComponent, propsEqual);
````

import { FormRefObject } from "../hooks/useForm";

export interface FieldBaseProps {
	name: string;
	form: FormRefObject;
	id: string;
	validator?: (value: any) => string | null;
	disabled?: boolean;
	label?: string;
}

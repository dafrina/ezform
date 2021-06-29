export interface FieldBaseProps {
	name: string;
	form: any;
	id: string;
	validator?: (value: any) => string | null;
	disabled?: boolean;
	label?: string;
}

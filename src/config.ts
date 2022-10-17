import {FormConfig} from "./types";

const _config: Partial<FormConfig> = {
	initialState: {},
	submitUnmountedFields: true,
	logging: {
		warnOnErrors: false,
		logFields: false,
	}
};

export const EzformConfig = (config?: Partial<FormConfig>): Partial<FormConfig> | void => {
	if (!config) return _config;

	Object.assign(_config, config);
};

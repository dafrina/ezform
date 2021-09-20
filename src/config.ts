import {FormConfig} from "./hooks";

const _config: Partial<FormConfig> = {
	initialState: {},
	submitUnmountedFields: true
};

const EzformConfig = (config?: Partial<FormConfig>): Partial<FormConfig> | void => {
	if (!config) return _config;

	Object.assign(_config, config);
};

export default EzformConfig;

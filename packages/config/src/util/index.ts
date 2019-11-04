interface ValidateOptions {
	required?: string[];
}

export function validate<T>(name: string, data: T | any = {}, defaultValue: T, options: ValidateOptions = {}): T {
	for (const [key, value] of Object.entries(defaultValue)) {
		if (!data[key]) data[key] = value;
		if (options.required &&
			options.required.includes(key) &&
			!data[key]
		) {
			throw new Error(`ConfigError: Could not fetch required value for "${name}.${key}"`);
		}
	}
	return (data as T);
}

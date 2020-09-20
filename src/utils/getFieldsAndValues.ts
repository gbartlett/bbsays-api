type Payload = {
	[key: string]: any;
};

export const getFieldsAndValuesForUpdate = (
	whitelistedFields: string[],
	payload: Payload,
	startParamIndex = 1
): {
	fields: string[];
	values: (string | number | boolean)[];
	nextParamIndex: number;
} => {
	const fieldNames = [];
	const fieldValues = [];
	let paramIndex = startParamIndex;

	for (const field of whitelistedFields) {
		if (Object.prototype.hasOwnProperty.call(payload, field)) {
			fieldNames.push(`${field} = ${paramIndex++}`);
			fieldValues.push(payload[field]);
		}
	}
	return {
		fields: fieldNames,
		values: fieldValues,
		nextParamIndex: paramIndex,
	};
};

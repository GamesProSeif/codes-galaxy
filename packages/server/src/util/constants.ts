export const MESSAGES = {
	SERVER: {
		MIDDLEWARES: {
			LOADED: (name: string) => `Loaded ${name} middleware`,
			ALL: 'Loaded all pre middlewares'
		},
		HANDLER: {
			ROUTE_LOADED: (id: string) => `Loaded route: ${id}`,
			LOADED: (methodsCount: number, endpointsCount: number) =>
				`Loaded ${methodsCount} routes with ${endpointsCount} endpoints`
		},
		LISTENING: (port: string) => `Server listening on http://localhost:${port}`
	},
	DB: {
		CONNECTED: 'Connected to DB'
	},
	ROUTES: {
		CODE_GET: {
			NOT_FOUND: 'No codes in database'
		},
		CODE_ID_GET: {
			NOT_FOUND: 'Code not found'
		},
		CODE_ID_DELETE: {
			NOT_FOUND: 'Code not found'
		}
	}
};

export const ERRORS = {
	SERVER: {
		ROUTE_ALREADY_LOADED: (id: string) => `Already loaded route ${id}`,
		HANDLER_ERROR: 'Something went wrong'
	},
	ROUTES: {
		CODE_POST: {
			MISSING_DATA: 'Missing body data'
		}
	}
};

import { ClientSocket } from 'veza';

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
		LISTENING: (port: number) => `Server listening on http://localhost:${port}`
	},
	DB: {
		CONNECTED: 'Connected to DB'
	},
	IPC: {
		CONNECT: (client: ClientSocket) => `Connected to ${client.name}`,
		CONNECTING: (port: number) => `Connecting to port ${port}`,
		DISCONNECT: (client: ClientSocket) => `Disconnected from ${client.name}`,
		NO_CONNECTION: (port: number) => `Cannot connect to IPC server on port ${port}. Exiting...`,
		READY: (client: ClientSocket) => `Connection to server ${client.name} ready`
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

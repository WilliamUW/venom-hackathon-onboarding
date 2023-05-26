export const SAMPLE_ABI = {
	"ABI version": 2,
	"version": "2.2",
	"header": ["time", "expire"],
	"functions": [
		{
			"name": "constructor",
			"inputs": [
				{"name":"_state","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "addSessionKeys",
			"inputs": [
				{"name":"hashes","type":"uint256[]"}
			],
			"outputs": [
			]
		},
		{
			"name": "setStateBySessionKey",
			"inputs": [
				{"name":"key","type":"string"},
				{"name":"_state","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "setStateByOwner",
			"inputs": [
				{"name":"_state","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "setStateByAnyone",
			"inputs": [
				{"name":"_state","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "state",
			"inputs": [
			],
			"outputs": [
				{"name":"state","type":"uint256[]"}
			]
		},
		{
			"name": "sessions",
			"inputs": [
			],
			"outputs": [
				{"components":[{"name":"created","type":"uint64"}],"name":"sessions","type":"map(uint256,tuple)"}
			]
		}
	],
	"data": [
		{"key":1,"name":"nonce","type":"uint256"},
		{"key":2,"name":"owner","type":"uint256"}
	],
	"events": [
		{
			"name": "StateChange",
			"inputs": [
				{"name":"_state","type":"uint256"}
			],
			"outputs": [
			]
		}
	],
	"fields": [
		{"name":"_pubkey","type":"uint256"},
		{"name":"_constructorFlag","type":"bool"},
		{"name":"nonce","type":"uint256"},
		{"name":"owner","type":"uint256"},
		{"name":"state","type":"uint256[]"},
		{"components":[{"name":"created","type":"uint64"}],"name":"sessions","type":"map(uint256,tuple)"},
		{"name":"m_messages","type":"map(uint256,uint32)"}
	]
} as const;
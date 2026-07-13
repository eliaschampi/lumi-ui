import { json } from '@sveltejs/kit';

interface WorkspaceItem {
	id: number;
	name: string;
}

const WORKSPACES: WorkspaceItem[] = [
	{ id: 1, name: 'Atlas Workspace' },
	{ id: 2, name: 'Northwind Lab' },
	{ id: 3, name: 'Nexus Portal' },
	{ id: 4, name: 'Orbit Studio' },
	{ id: 5, name: 'Vertex Cloud' },
	{ id: 6, name: 'Pulse Center' },
	{ id: 7, name: 'Lumi Workspace' },
	{ id: 8, name: 'Cobalt Studio' },
	{ id: 9, name: 'Aurora Project' },
	{ id: 10, name: 'Helix Lab' }
];

export function GET({ url }: { url: URL }): Response {
	const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
	const limit = Number(url.searchParams.get('limit') ?? '10');
	const filtered =
		query.length === 0
			? WORKSPACES
			: WORKSPACES.filter((item) => item.name.toLowerCase().includes(query));
	return json(filtered.slice(0, limit));
}

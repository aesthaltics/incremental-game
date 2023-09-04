type GamePresenterProps = {
	resources: Resource[];
	buildings: Building[];
	updateResourceClick: (id: string) => void;
	addBuilding: (id: string, amount: number) => void;
	upgrades: { [id: string]: Upgrade };
	applyGameUpgrade: (id: string) => void;
	fps: string;
	logMessages: LogMessage[];
};

type Building = {
	baseRate: number;
	id: string;
	name: string;
	produces: string;
	amount: number;
};

type Resource = {
	id: string;
	name: string;
	value: number;
};

type Upgrade = {
	id: string;
	name: string;
	effect: (gameState: GameState) => GameState; // Replace 'any' with your actual game state type
};

type GameState = {
	resources: { [id: string]: Resource };
	buildings: { [id: string]: Building };
	updateBuilding: (buildingId: string, newBuilding: Building) => void;
	// Add more game state data if needed
};
type LogMessage = {
	id: string;
	message: string;
	timestamp: number;
};

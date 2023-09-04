import { useCallback, useEffect, useMemo, useState } from "react";



const useGameLoop = (updateLogic: (deltaTimeMs: number) => void) => {
	useEffect(() => {
		let animationFrameId: number;
		let lastFrameTime = Date.now();

		const loop = () => {
			const now = Date.now();
			const deltaTimeMs = now - lastFrameTime;
			lastFrameTime = now;

			updateLogic(deltaTimeMs);
			// console.log("test")
			animationFrameId = requestAnimationFrame(loop);
		};

		loop();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [updateLogic]);
};

const useGameEngine = () => {
	const { resources, handleUpdate } = useResources();
	const { buildings, generateResources, addBuilding, updateBuilding } =
		useBuildings(handleUpdate);
	const { upgrades, applyUpgrade } = useUpgrades();
	const [logMessages, setLogMessages] = useState<LogMessage[]>([]);
	const MAX_LOG_ENTRIES = 100;

	const doTick = useCallback(
		(deltaTimeMs: number) => {
			generateResources(deltaTimeMs);
		},
		[generateResources]
	);

	const updateResourceClick = (id: string) => handleUpdate(id, 1);

	const applyGameUpgrade = (id: string) => {
		const gameState: GameState = {resources, buildings, updateBuilding }; // Add more game state data if needed
		const newState = applyUpgrade(id, gameState);
		logUpgrade(upgrades[id].name);
		// Assume newState contains updated 'resources' and 'buildings'
		// Add logic to update resources and buildings state
	};
	const addLogMessage = useCallback((message: string) => {
		setLogMessages((prevLogMessages) => {
			const newMessage = {
				id: `${Date.now()}-${Math.random()}`,
				message,
				timestamp: Date.now(),
			};
			const newLogMessages = [...prevLogMessages, newMessage];
			return newLogMessages.slice(-MAX_LOG_ENTRIES); // Keep only the last X entries
		});
	}, []);
	const logUpgrade = (upgradeName: string) => {
		const funnyMessages = [
			`You're becoming a tycoon with the ${upgradeName}!`,
			`Don't get too power-hungry now that you have ${upgradeName}.`,
			`Ah, the ${upgradeName}. A fine choice, indeed!`,
		];
		const randomMessage =
			funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

		addLogMessage(randomMessage);
	};

	return {
		resources,
		buildings,
		upgrades,
		doTick,
		updateResourceClick,
		addBuilding,
		applyGameUpgrade,
		logMessages,
	};
};

const useUpdateResource = () => {
	const updateResource = useCallback(
		(
			prevResources: { [id: string]: Resource },
			id: string,
			amount: number
		) => {
			const newResources = { ...prevResources };
			newResources[id].value += amount;
			return newResources;
		},
		[]
	);
	return updateResource;
};

export const useResources = () => {
	const [resources, setResources] = useState<{ [id: string]: Resource }>({
		food: { id: "food", name: "Food", value: 0 },
		stone: { id: "stone", name: "Stone", value: 0 },
	});
	const updateResource = useUpdateResource();

	const handleUpdate = useCallback(
		(id: string, amount: number) => {
			setResources((prevResources) =>
				updateResource(prevResources, id, amount)
			);
		},
		[updateResource]
	);

	return { resources, handleUpdate };
};
const useUpdateBuilding = (
	setBuildings: React.Dispatch<
		React.SetStateAction<{ [id: string]: Building }>
	>
) => {
	const addBuilding = useCallback((id: string, amount: number) => {
		setBuildings((prevBuildings) => {
			const newBuildings = { ...prevBuildings };
			newBuildings[id].amount += amount;
			return newBuildings;
		});
	}, [setBuildings]);
	const updateBuilding = (buildingId: string, newBuilding: Building) => {
		setBuildings((prevBuildings) => {
			const newBuildings = {...prevBuildings};
			newBuildings[buildingId] = newBuilding;
			return newBuildings;
		});
	};

	return { addBuilding, updateBuilding };
};
const useBuildings = (updateResource: (id: string, amount: number) => void) => {
	const [buildings, setBuildings] = useState<{ [id: string]: Building }>({
		farm: {
			id: "farm",
			name: "Farm",
			produces: "food",
			baseRate: 1,
			amount: 1,
		},
		quarry: {
			id: "quarry",
			name: "Quarry",
			produces: "stone",
			baseRate: 1,
			amount: 1,
		},
	});

	const { addBuilding, updateBuilding } = useUpdateBuilding(setBuildings);

	const generateResources = useCallback(
		(deltaTimeMs: number) => {
			for (const id in buildings) {
				const building = buildings[id];
				updateResource(
					building.produces,
					(building.amount * building.baseRate * deltaTimeMs) / 1000
				);
			}
		},
		[buildings, updateResource]
	);

	return { buildings, generateResources, addBuilding, updateBuilding };
};

const useUpgrades = () => {
	const [upgrades, setUpgrades] = useState<{ [id: string]: Upgrade }>({
		// Example upgrades
		doubleFarms: {
			id: "doubleFarms",
			name: "Double Farm Production",
			effect: (gameState: GameState) => {
				const prevFarm = gameState.buildings.farm;
				const newFarm = {...prevFarm, baseRate: prevFarm.baseRate * 2};
				gameState.updateBuilding("farm", newFarm);

				return gameState;
			},
		},
		// Add more upgrades here
	});

	const applyUpgrade = useCallback(
		(id: string, gameState: GameState) => {
			return upgrades[id].effect(gameState);
		},
		[upgrades]
	);

	return { upgrades, applyUpgrade };
};

export { useGameEngine, useGameLoop };
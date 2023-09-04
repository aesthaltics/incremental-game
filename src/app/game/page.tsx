"use client";

import build from "next/dist/build";
import React, { useCallback, useEffect, useState, useMemo, useContext } from "react";
import { useGameEngine, useGameLoop} from "./gameLogic"
import { GamePresenter } from "./components/presenters";



const GameContainer = () => {
	const {
		resources,
		buildings,
		doTick,
		updateResourceClick,
		addBuilding,
		upgrades,
		applyGameUpgrade,
		logMessages,
	} = useGameEngine();
	const [fps, setFps] = useState(0);
	const [fpsList, setFpsList] = useState<number[]>([]);

	const updateLogic = useCallback(
		(deltaTimeMs: number) => {
			doTick(deltaTimeMs);
			const currentFps = 1000 / deltaTimeMs;
			setFpsList((prevFpsList) => {
				const newFpsList = [...prevFpsList, currentFps];
				if (newFpsList.length > 10) {
					// Keep the last 10 frames
					newFpsList.shift();
				}
				return newFpsList;
			});
		},
		[doTick]
	);
	const averageFps = useMemo(() => {
		const sum = fpsList.reduce((a, b) => a + b, 0);
		return fpsList.length ? (sum / fpsList.length).toFixed(2) : "0";
	}, [fpsList]);
	useGameLoop(updateLogic);

	return (
		<GamePresenter
			resources={Object.values(resources)}
			buildings={Object.values(buildings)}
			upgrades={upgrades}
			updateResourceClick={updateResourceClick}
			addBuilding={addBuilding}
			applyGameUpgrade={applyGameUpgrade}
			fps={averageFps}
			logMessages={logMessages}
		/>
	);
};
export default GameContainer;
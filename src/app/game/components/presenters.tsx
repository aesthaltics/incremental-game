import { useRef, useEffect } from "react";

const GamePresenter = ({
	resources,
	buildings,
	upgrades,
	updateResourceClick,
	addBuilding,
	applyGameUpgrade,
	fps,
	logMessages,
}: GamePresenterProps) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [logMessages]);


	return (
		<div className="flex flex-col w-screen h-screen">
			<header className="flex justify-around p-4">
				<h1 className="text-2xl font-bold">Game</h1>
				<div className="flex">
					<p className="text-sm font-bold">FPS: {fps}</p>
				</div>
			</header>
			<main className="flex justify-around mt-8 ml-5">
				<div className="flex flex-col mx-3">
					<h2 className="text-xl font-bold">Resources</h2>
					{resources.map((resource) => (
						<ResourcePresenter
							key={resource.id}
							resource={resource}
							buttonText="Click"
							handleClick={() => updateResourceClick(resource.id)}
						/>
					))}
				</div>
				<div className="flex flex-col mx-3">
					<h2 className="text-xl font-bold">Buildings</h2>
					{buildings.map((building) => (
						<BuildingPresenter
							key={building.id}
							building={building}
							handleBuild={() => addBuilding(building.id, 1)}
						/>
					))}
				</div>
				<div className="flex flex-col mx-3">
					<h2 className="text-xl font-bold">Upgrades</h2>
					{Object.values(upgrades).map((upgrade) => (
						<UpgradePresenter
							key={upgrade.id}
							upgrade={upgrade}
							handleUpgrade={() => applyGameUpgrade(upgrade.id)}
						/>
					))}
				</div>
			</main>
			<div className="flex flex-col mx-3 w-[300px] border rounded-lg shadow-md bg-gradient-to-t from-gray-800 to-gray-900 font-sans">
				<div className="p-2 bg-gray-900 border-b rounded-t-lg">
					<h2 className="text-lg font-medium">Game Log</h2>
				</div>
				<div className="overflow-y-auto max-h-[350px] transition-all">
					{logMessages.map((message) => (
						<LogMessagePresenter
							key={message.id}
							message={message}
						/>
					))}
					<div ref={messagesEndRef}></div>
				</div>
			</div>
		</div>
	);
};

const ResourcePresenter = ({
	resource,
	buttonText,
	handleClick,
}: {
	resource: Resource;
	buttonText: string;
	handleClick: () => void;
}) => {
	return (
		<div className="flex my-2">
			<p className="text-md font-bold">
				{resource.name}: {Math.floor(resource.value)}
			</p>
			<button
				className="h-auto bg-green-400 rounded-lg w-20 text-lg hover:scale-110 active:scale-90 duration-100 ease-in-out ml-10"
				onClick={handleClick}
			>
				{buttonText}
			</button>
		</div>
	);
};

const BuildingPresenter = ({
	building,
	handleBuild,
}: {
	building: Building;
	handleBuild: () => void;
}) => {
	return (
		<div className="flex my-2">
			<p className="text-md font-bold">
				{building.name}: {building.amount}
			</p>
			<button
				className="h-auto bg-green-400 rounded-lg w-20 text-lg hover:scale-110 active:scale-90 duration-100 ease-in-out ml-10"
				onClick={handleBuild}
			>
				Build
			</button>
		</div>
	);
};
type UpgradePresenterProps = {
	upgrade: Upgrade;
	handleUpgrade: () => void;
};

const UpgradePresenter = ({
	upgrade,
	handleUpgrade,
}: UpgradePresenterProps) => {
	return (
		<div className="flex my-2">
			<p className="text-md font-bold">{upgrade.name}</p>
			<button
				className="h-auto bg-blue-400 rounded-lg w-20 text-lg hover:scale-110 active:scale-90 duration-100 ease-in-out ml-10"
				onClick={handleUpgrade}
			>
				Upgrade
			</button>
		</div>
	);
};


const LogMessagePresenter = ({ message }: { message: LogMessage }) => {
	return (
		<div className="p-1 transition-opacity duration-300 animate-fadeIn">
			<p className="text-xs font-medium">
				{new Date(message.timestamp).toLocaleTimeString()}:{" "}
				{message.message}
			</p>
		</div>
	);
};


export {GamePresenter}
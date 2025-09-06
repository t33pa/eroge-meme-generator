export type Dictionary = {
	metadata: {
		title: string;
		description: string;
	};
	header: {
		home: string;
		about: string;
		switch: string;
	};
	main: {
		defaultTitle: string;
		defaultTexts: string[];
		search: string;
		addGame: string;
		loading: string;
		noResults: string;
		takeScreenshot: string;
	};
	about: {
		title: string;
		description1: string;
		description2: string;
		usageHeader: string;
		usage1: string;
		usage2: string;
		usage3: string;
		miscHeader: string;
		misc1: string;
		misc2: string;
		misc3: string;
		invite: string;
	};
};

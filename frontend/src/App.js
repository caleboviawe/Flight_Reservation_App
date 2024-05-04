import PageContent from "./classes/PageContent";
import PageDecorator from "./classes/PageDecorator";

function App() {
	const ViewWithHeader = new PageDecorator(PageContent).render();

	return (
		<div className="App">
			<ViewWithHeader />
		</div>
	);
}

export default App;

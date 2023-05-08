import React from "react";

const Search = ({ searchValue, setSearchValue, setToggleSearch }) => {
	const handleSubmit = (e) => {
		e.preventDefault();
	};

	const handleFocus = async () => {
		if (searchValue !== "") {
			setToggleSearch(true);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder="Search Sociable"
				className="bg-slate-100 dark:bg-zinc-700 outline-none px-5 py-2 rounded-full w-full"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				onFocus={handleFocus}
			/>
		</form>
	);
};

export default Search;

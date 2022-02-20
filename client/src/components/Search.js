import './Search.css';

const Search = () => (
    <form className='search-box' action="/" method="get">
        <input
            className='search'
            type="text"
            id="header-search"
            placeholder="Search Projects"
            name="s" 
        />
        <button className='search-button' type="submit">Search</button>
    </form>
);

export default Search;
interface NavProps {
        loggedIn: boolean;
    }

function Navbar(props : NavProps) {

   const setLoggedIn = () => {
        props.loggedIn = !props.loggedIn;
    }

    return (
        props.loggedIn === true ?
        <div className="flex justify-items-center border-gray-700 border-b-2 bg-neutral-900 w-screen text-gray-500">
            <button className="hover:bg-neutral-800 m-1 hover:text-white rounded-lg">Home</button>
            <button className="hover:bg-neutral-800 m-1 hover:text-white rounded-lg">Programs</button>
        </div>
        :
        <div className="flex justify-items-center border-gray-700 border-b-2 bg-neutral-900 w-screen text-gray-500">
            <button onClick={setLoggedIn} className="hover:bg-neutral-800 m-1 hover:text-white rounded-lg">Login</button>
            <button className="hover:bg-neutral-800 m-1 hover:text-white rounded-lg">Signup</button>
        </div>
    );
}

export default Navbar;
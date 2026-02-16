import { NavLink } from "react-router-dom";

function NavBar() {
    const base =
        "px-5 py-2 rounded-full inline-block transition-all duration-200 text-sm font-medium";

    const inactive =
        "text-white/60 hover:text-white";

    const active =
        "bg-white text-black";

    return (
        <div
            id="navbar"
            className="SG absolute z-20 flex justify-between items-center w-full h-15 "
        >
            {/* LEFT FILL */}
            <div
                className="flex-1 h-full flex bg-transparent relative
          before:w-9 before:h-9 before:absolute before:content-['']
          before:bg-transparent before:top-0 before:right-0
          before:rounded-tr-3xl before:z-20
          before:shadow-[0.5rem_-0.8rem_black]"
            />

            {/* NOTCH */}
            <div
                id="notch"
                className="bg-black flex h-fit w-fit pt-3 p-3 rounded-b-3xl relative -translate-y-2"
            >
                <div
                    id="menu-buttons"
                    className="flex gap-1 items-center overflow-hidden rounded-full"
                >
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `${base} ${isActive ? active : inactive}`
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `${base} ${isActive ? active : inactive}`
                        }
                    >
                        About
                    </NavLink>

                    <NavLink
                        to="/works"
                        className={({ isActive }) =>
                            `${base} ${isActive ? active : inactive}`
                        }
                    >
                        Works
                    </NavLink>
                </div>
            </div>

            {/* RIGHT FILL */}
            <div
                className="flex-1 h-full flex bg-transparent relative
          before:w-9 before:h-9 before:absolute before:content-['']
          before:bg-transparent before:top-0 before:left-0
          before:rounded-tl-3xl
          before:shadow-[-0.5rem_-0.8rem_black]"
            />
        </div>
    );
}

export default NavBar;

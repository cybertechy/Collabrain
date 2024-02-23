import React, { useState, useEffect } from "react";
import { User, Users } from "lucide-react";
import { toast } from 'react-toastify';


const share = ({ contentMapName = "Content Map", sData, setShare, isOwner, updatecontent, getdata, publicData,setpublicData }) => {
    const [sharewith, setSharewith] = useState("");
    const [shareData, setShareData] = useState(sData);
    const [searchResults, setSearchResults] = useState([]);
    const [selected, setSelected] = useState({});
    const [newShare, setnewShare] = useState("View");
    const [LoadingSearchResults, setLoadingSearchResults] = useState(null);
    const [Noresults, setNoresults] = useState(false);
    const [publicShare, setpublicShare] = useState(publicData==="Yes" ? "Yes" : "No");    


    const select = (userid, type) => {
        //select the search result based on id
        let access = searchResults[type].filter((result) => result.id === userid);
        setSearchResults(access);
        access[0].type = type;
        setSelected(access[0]);
    }

    const setPermission = async (id, permission, type, email, name) => {
        //set permission for user
        let temp = shareData;
        let backupRole = temp[id]?.role;
        let revokeAccess = false;

        if (permission === "Revoke Access") { delete temp[id]; revokeAccess = true; }
        else if (backupRole) temp[id].role = permission.toLowerCase();


        else temp[id] = { role: permission.toLowerCase(), type, email, name };

        setShareData(temp);
        setShare(false);

        try {
            let res = await updatecontent({ access: temp, [type==="users"?"user":"team"]: id, revokeAccess });
            toast.success("Permission Updated", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored",
            });
        } catch (err) {
            temp[id].role = backupRole;
            setShareData(temp);
            toast.error("Failed to set permission, Try again!", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored",
            });
        }
    }

    const search = async (e) => {
        //search for users based on input
        setSharewith(e.target.value);
        setSelected("");
        setNoresults(false);
        setSearchResults([]);
        if (e.target.value.length >= 3) {
            try {
                setNoresults(false);
                setLoadingSearchResults(true);
                let res = await getdata(`query=${e.target.value}`);
                setLoadingSearchResults(false);

                //filter out the users and teams from the response
                res.data.users = res.data.users.filter((user) => !Object.keys(shareData).includes(user.id));
                res.data.teams = res.data.teams.filter((team) => !Object.keys(shareData).includes(team.id));

                if (res.data.users.length === 0 && res.data.teams.length === 0 && e.target.value.length >= 3) { setNoresults(true); setLoadingSearchResults(false); }
                setSearchResults(res.data);
            }
            catch (err) {
                setLoadingSearchResults(false);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
            setLoadingSearchResults(false);
            setNoresults(false);
        }

    }



    const changePublicShare = async (value) => {
        //set public share
        setShare(false);
        setpublicShare(value);
        try {
            let res = await updatecontent({ public: value });
            toast.success(`Public Share ${value==="Yes"?"Enabled":"Disabled"} `, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored",
            });
            setpublicData(value);
        } catch (err) {
            setpublicShare(value==="Yes"?"No":"Yes");
            toast.error("Failed to set public share, Try again!", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored",
            });
        }
    }


    return <div className="flex flex-col text-primary w-80 gap-2">
        <h1 className="text-xl"> Share "{contentMapName}"</h1>
        <input disabled={!isOwner} onChange={search} value={sharewith} className="border border-primary rounded-lg p-2 outline-none" placeholder="Add people or groups" />
        {
            LoadingSearchResults && <><hr className="border border-primary w-80"></hr>
                <p className="text text-primary text-center ">Searching ...</p>
            </>

        }
        {
            Noresults && <><hr className="border border-primary w-80"></hr>
                <p className="text text-primary text-center ">No results found</p>
            </>
        }
        {
            Object.keys(searchResults).length > 0 && <div className="flex flex-col gap-2 h-[40%]">
                <hr className="border border-primary w-80"></hr>
                <div className="flex flex-col gap-2">
                    {searchResults?.users?.length > 0 &&
                        <p className="text-sm text-primary">People</p>
                    }
                    {
                        searchResults?.users?.map((result, index) => <button key={index} onClick={() => select(result.id, "users")} id={result.id} name={result.id} className="flex items-center gap-2 hover:bg-secondary rounded-lg py-2 px-2">
                            <User width={25} height={25} />
                            <div className="flex flex-col ml-5">
                                <p className="text-sm text-left">{result.name}</p>
                                <p className="text-xs text-left">{result.email}</p>
                            </div>
                        </button>)
                    }
                    {searchResults?.teams?.length > 0 &&
                        <p className="text-sm text-primary">Teams</p>
                    }
                    {
                        searchResults?.teams?.map((result, index) => <button key={index} onClick={() => select(result.id, "teams")} id={result.id} name={result.id} className="flex items-center gap-2 hover:bg-secondary rounded-lg py-2 px-2">
                            <Users width={25} height={25} />
                            <div className="flex flex-col ml-5">
                                <p className="text-sm text-left">{result.name}</p>
                            </div>
                        </button>)
                    }

                </div>
            </div>
        }


        {!Object.keys(selected).length > 0 && <div className="flex flex-col  ">
            <h2 className="text-lg mb-1">People/Groups with access</h2>
            <hr className="border border-primary w-80 mb-3"></hr>

            <div className="flex flex-col gap-2 h-[20vh] overflow-y-auto">
            {
                Object.keys(shareData).length > 0 && Object.keys(shareData).map((key, index) => <div key={index} className="flex gap-2 justify-between items-center hover:bg-secondary rounded-lg py-2 px-2 ">
                    <div className="flex items-center">
                        {shareData[key]?.type === "users" ? <User width={25} height={25} /> : <Users width={25} height={25} />}
                        <div className="flex flex-col ml-5">
                            <p className="text-sm text-left">{shareData[key].name}</p>
                            {shareData[key]?.type === "users" && <p className="text-xs">{shareData[key].email}</p>}
                        </div>
                    </div>

                    {shareData[key].role === "owner" ? <p>Owner</p> : <select onChange={(e) => setPermission(key, e.target.value,shareData[key]?.type)} value={shareData[key].role === "edit" ? "Edit" : "View"} disabled={!isOwner} className="outline-none bg-none p-2 rounded-lg bg-inherit text-sm">
                        <option >View</option>
                        <option>Edit</option>
                        {/*Add divider to show this is a special operation*/}
                        <hr className="text-primary"></hr>
                        <option>Revoke Access</option>
                    </select>}
                </div>)
            }
            </div>

        </div>}
        

        {
            Object.keys(selected).length > 0 && <div className="flex flex-col ">
                <h2 className="text-lg mb-1">Share with: {selected.name}</h2>
                <h2 className="text-lg mb-1">Permission</h2>
                <select value={newShare} onChange={(e) => setnewShare(e.target.value)} className="outline-none bg-none p-2 rounded-lg bg-inherit text-sm">
                    <option>View</option>
                    <option>Edit</option>
                </select>
                <button onClick={() => setPermission(selected.id, newShare, selected.type, selected.email, selected.name)} className="bg-primary text-basicallylight rounded-lg p-2">Share</button>
            </div>
        }

        {Object.keys(selected).length < 1  && <div className="flex flex-col ">
            <h2 className="text-lg ">Anyone can access: </h2>
            <select value={publicShare} onChange={(e) => setpublicShare(e.target.value)} className="outline-none bg-none p-2 rounded-lg bg-inherit text-sm mb-3">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
            </select>
            <button onClick={() => changePublicShare(publicShare)} className="bg-primary text-basicallylight rounded-lg p-2">Share</button>
        </div>}


    </div>
};

export default share;

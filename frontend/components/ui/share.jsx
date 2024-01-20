import React, { useState } from "react";
import { User } from "lucide-react";


const share = ({ contentMapName = "Content Map", sData, setShare , isOwner }) => {
    const [sharewith, setSharewith] = useState();
    const [shareData, setShareData] = useState(sData);
    const [searchResults, setSearchResults] = useState([{
        id:'1',
        name: 'Siddh Tailor',
        email: 'siddhtailor96@gmail.com',
    }]);
    const [selected, setSelected] = useState("");

    const select = (userid) => {
        //select the search result based on id
        console.log(userid);
        let access = searchResults.filter((result) => result.id === userid);
        setSearchResults(access);
        console.log(access);
        access = access[0];
        setSelected(access);
    }

    const SendtoClient = () => {
        //send data to client
        console.log(shareData);
        setShare(false);
    }



    return <div className="flex flex-col text-purple-600 w-80 gap-2">
        <h1 className="text-xl"> Share "{contentMapName}"</h1>
        <input onChange={(e)=>setSharewith(e.target.value)} value={sharewith} className="border border-purple-600 rounded-lg p-2 outline-none" placeholder="Add people or groups" />
        {
            searchResults.length > 0 && <div className="flex flex-col gap-2">
                <hr className="border border-purple-600 w-80"></hr>
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-purple-600">People</p>
                    {
                        searchResults.map((result, index) => <button key={index} onClick={()=>select(result.id)} id={result.id} name={result.id}  className="flex items-center gap-2 hover:bg-purple-100 rounded-lg py-2 px-2">
                            <User width={25} height={25} />
                            <div className="flex flex-col ml-5">
                                <p className="text-sm">{result.name}</p>
                                <p className="text-xs">{result.email}</p>
                            </div>
                        </button>)
                    }
                </div>
            </div>
        }

    
        {!selected && <div className="flex flex-col ">
            <h2 className="text-lg mb-1">People/Groups with access</h2>
            <hr className="border border-purple-600 w-80 mb-3"></hr>

            {
                Object.keys(shareData).map((key, index) => <div key={index} className="flex gap-2 justify-between items-center hover:bg-purple-100 rounded-lg py-2 px-2">
                    <div className="flex items-center">
                        <User width={25} height={25} />
                        <div className="flex flex-col ml-5">
                            <p className="text-sm">{shareData[key].name}</p>
                            <p className="text-xs">{shareData[key].email}</p>
                        </div>
                    </div>

                    {shareData[key].role==="owner"? <p>Owner</p>:<select disabled={isOwner} className="outline-none bg-none p-2 rounded-lg bg-inherit text-sm">
                        <option>View</option>
                        <option>Edit</option>
                        {/*Add divider to show this is a special operation*/}
                        <hr className="text-purple-600"></hr>
                        <option>Revoke Access</option>
                    </select>}
                </div>)
            }

        </div>}

        {
            selected && <div className="flex flex-col ">
                <h2 className="text-lg mb-1">Permission</h2>
                <select className="outline-none bg-none p-2 rounded-lg bg-inherit text-sm">
                    <option>View</option>
                    <option>Edit</option>
                </select>
                <button onClick={SendtoClient} className="bg-purple-600 text-white rounded-lg p-2">Share</button>
                </div>  
        }
    </div>
};

export default share;

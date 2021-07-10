import { Dropdown,DropdownButton } from "react-bootstrap";

const MenuDrop =() =>{

    return(
        <>
            <DropdownButton id="dropdown-basic-button" title="Online Users">
            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title="Notes">
                <textarea rows="25" cols="40"></textarea>
            </DropdownButton>
        </>
    )
}

export default MenuDrop;

/*
{peopleInRoom.map((name) =>{
                <Dropdown.Item>{name}</Dropdown.Item>
                }

*/

{/*
                        <div className="row">
                            <DropdownButton id="dropdown-basic-button" title="Online Users">
                                {peopleInRoom.map((name) =>{
                                <Dropdown.Item>{name}</Dropdown.Item>
                                }
                                )
                            }   
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" title="Notes">
                                <textarea rows="25" cols="40"></textarea>
                            </DropdownButton>
                        </div>
                        */}
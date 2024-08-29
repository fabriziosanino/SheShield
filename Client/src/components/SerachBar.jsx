import {
    Combobox,
    ComboboxButton,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxInput
} from '@reach/combobox';
import '@reach/combobox/styles.css'

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng
} from 'use-places-autocomplete';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faUserMd, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import API from '../API';

function SearchBar(props) {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions
    } = usePlacesAutocomplete({ callbackName: "PlacesAutocomplete" });

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        API.insertRecentAddress({ address: address, userId: parseInt(props.user.id) })
            .then(() => {
                props.setDirtyRecents(true);
            })
            .catch(() => {
            console.log("err");
            });

        const result = await getGeocode({ address });
        const { lat, lng } = await getLatLng(result[0]);
        if (lat != 0 && lat != null && lng != 0 && lng != null)
            props.setSelected({ lat: lat, lng: lng });  
                  
        props.setDestination(address); 
        props.setShowDirections(true); 
        props.setSearchLocationStarted(false);
    }

    const switchUser = () => {
        if (props.user.role === "user"){
            props.handleUserSwitch({"id": 1, "role": "psychologist"});
            props.setChosenChatInfo('');
        }else{
            props.handleUserSwitch({"id": 0, "role": "user"});
            props.setChosenChatInfo('');
        }   
    }

    return (
        <Combobox className="searchbar-component" onSelect={handleSelect}>
            { props.searchLocationStarted ?
                <div onClick={()=>{props.setSearchLocationStarted(false); setValue('');}} style={{ padding: "4%", cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                : <></>
            }
            <ComboboxInput 
                value={value}
                onChange={e => {
                    setValue(e.target.value);
                    if (e.target.value == '')
                        props.setSelected(null);
                }} 
                disabled={!ready || props.disabled} 
                className='combobox-input' 
                placeholder="Where you wanna go ?"
                style={{backgroundColor: "white", border: 0, color: "black"}}
                onClick={()=>props.setSearchLocationStarted(true)}
            />
            <FontAwesomeIcon icon={faSearch} style={{margin: "4%"}}/> 
            {
            props.user.role === "user" ?
                <div onClick={switchUser} style={{ padding: "4%", borderLeft: "1px solid black", cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faUser}/>
                </div>
                :
                <div onClick={switchUser} style={{ padding: "4%", borderLeft: "1px solid black", cursor: 'pointer', color: "darkred" }}>
                    <FontAwesomeIcon icon={faUserMd}/>
                </div>
            }
            <ComboboxPopover style={{zIndex: 102}}>
                <ComboboxList style={{zIndex: 102}}>
                    {status === "OK" && data.map(({ place_id, description }) => <ComboboxOption style={{zIndex: 102}} key={place_id} value={description} onSelect={handleSelect}/>)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}

export { SearchBar }
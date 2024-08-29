import {
    Combobox,
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

function PlacesAutocomplete(props) {
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
        
        const result = await getGeocode({ address });
        const { lat, lng } = await getLatLng(result[0]);
        if (lat != 0 && lat != null && lng != 0 && lng != null)
            props.setSelected({ lat: lat, lng: lng });
    }

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput 
                value={value}
                onChange={e => {
                    setValue(e.target.value);
                    if (e.target.value == '')
                        props.setSelected(null);
                }} 
                disabled={!ready || props.disabled} 
                className='combobox-input rounded-5 customLocation'
                placeholder="Search Location"
                style={{width: '58vw', textAlign:"center", height:"4.1vh", backgroundColor:"#212529", color: 'whitesmoke'}}
            />
            <ComboboxPopover >
                <ComboboxList>
                    {status === "OK" && data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description}/>)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}

export { PlacesAutocomplete }
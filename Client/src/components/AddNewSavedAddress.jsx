import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Alert } from 'react-bootstrap';
import {
  Combobox,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxInput
} from '@reach/combobox';
import '@reach/combobox/styles.css'
import usePlacesAutocomplete from 'use-places-autocomplete';

import { useState, useEffect } from 'react';
import API from '../API';

function AddNewSavedAddress(props) {
  const [formError, setFormError] = useState(false);
  const [addressLabel, setAddressLabel] = useState('');
  const [addressAddress, setAddressAddress] = useState(null);
  const [chosenAddress, setChosenAddress] = useState(false);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete({ callbackName: "PlacesAutocomplete" });

  const handleSelect = async (address) => {
    setValue(address, false);
    setAddressAddress(address);
    setChosenAddress(true);
    clearSuggestions();
  }

  const insertSavedAddress = () => {
    !addressLabel || !chosenAddress ?
      setFormError(true)
      :
      API.insertSavedAddress({ label: addressLabel, address: addressAddress ? addressAddress : '', userId: parseInt(props.user.id) })
        .then(() => {
          props.setActionPerformed('Add');
          props.setShowFeedbackPopUp(true);
          props.setDirtyAddresses(true);
          props.setAddNewSavedAddress(false);
        })
        .catch(() => {
          console.log("err");
        });
  }

  useEffect(() => {
    if (formError) {
      setTimeout(() => {
        setFormError(false);
      }, 4000);
    }
  }, [formError]);

  return (
    <div className="edit-saved-address">
      <div className="back-from-edit">
        <FontAwesomeIcon icon={faArrowLeft} size="xl" onClick={() => props.setAddNewSavedAddress(false)} />
      </div>
      <div className="edit-address-title">
        <h1>Add New Address</h1>
      </div>
      <div className="add-address-content">
        <label>
          Address Name<input name="addressName" required style={{ width: "-webkit-fill-available" }} value={addressLabel} onChange={e => setAddressLabel(e.target.value)} />
        </label>
        <label style={{ marginTop: "5%" }}>Address Value</label>
        <Combobox onSelect={handleSelect}>
          <ComboboxInput
            value={value}
            onChange={e => {
              setValue(e.target.value);
              if (e.target.value == '')
                setAddressAddress(null);
            }}
            disabled={!ready}
            placeholder="Search Address"
            style={{ zIndex: "150", width: "-webkit-fill-available", textAlign: "center" }}
          />
          <ComboboxPopover style={{zIndex: "150"}}>
            <ComboboxList style={{zIndex: "150"}}>
              {status === "OK" && data.map(({ place_id, description }) => <ComboboxOption style={{zIndex: "150"}} key={place_id} value={description} />)}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
      </div>
      <div className="edit-address-buttons">
        <Button className="edit-address-button-single" variant="primary" onClick={insertSavedAddress}>Add<br />Address</Button>
      </div>
      {formError ?
        <Alert variant="danger" className="dismissable-popup-error" onClose={() => setFormError(false)} dismissible>
          <Alert.Heading>Error, Try Again!</Alert.Heading>
          <p>
            <i>Address Name</i> and <i>Address Value</i> fields required, please fill in the related input or tap a suggestion.
          </p>
        </Alert>
        : <></>
      }
    </div>
  );
}

export { AddNewSavedAddress }